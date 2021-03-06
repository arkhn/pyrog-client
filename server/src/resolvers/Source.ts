import { objectType, FieldResolver, booleanArg, nonNull } from 'nexus'

import { getDefinition } from 'fhir'
import { importMapping, exportMapping } from 'resolvers/mapping'
import {
  AttributeWithInputGroups,
  ResourceWithAttributes,
  InputGroupWithInputs,
} from 'types'
import { Comment, Condition, Input, Owner } from '@prisma/client'

export const Source = objectType({
  name: 'Source',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.version()

    t.model.resources()
    t.model.credential()
    t.model.template()
    t.model.accessControls()

    t.model.updatedAt()
    t.model.createdAt()

    t.nullable.field('mapping', {
      type: 'String',
      args: { includeComments: nonNull(booleanArg({ default: true })) },
      resolve: (parent, { includeComments }, ctx) =>
        exportMapping(ctx.prisma, parent.id, includeComments!),
    })

    t.nullable.list.field('mappingProgress', {
      type: 'Int',
      resolve: async (parent, _, ctx) => {
        const resources = await ctx.prisma.resource.findMany({
          include: {
            attributes: {
              include: {
                inputGroups: true,
              },
            },
          },
          where: { source: { id: parent.id } },
        })

        const nbAttributes = resources.reduce(
          (acc, r) =>
            acc +
            r.attributes.filter(a => a.inputGroups && a.inputGroups.length > 0)
              .length,
          0,
        )
        return [resources.length, nbAttributes]
      },
    })

    t.list.field('usedConceptMapIds', {
      type: 'String',
      resolve: usedConceptMaps,
    })

    t.list.field('usedProfileIds', {
      type: 'String',
      resolve: usedProfiles,
    })
  },
})

export const sources: FieldResolver<'Query', 'sources'> = async (
  _parent,
  _args,
  ctx,
) => {
  const { role, id } = ctx.user!

  if (role === 'ADMIN') return ctx.prisma.source.findMany()

  return ctx.prisma.source.findMany({
    where: { accessControls: { some: { user: { id } } } },
  })
}

export const createSource: FieldResolver<'Mutation', 'createSource'> = async (
  _parent,
  { templateName, name, mapping },
  ctx,
) => {
  // create the source
  let parsedMapping
  if (mapping) {
    parsedMapping = JSON.parse(mapping)
  }
  const source = await ctx.prisma.source.create({
    data: {
      name,
      template: { connect: { name: templateName } },
      credential:
        // if a credential is present in the mapping (it should), create an empty credential object
        // but re-create the credential's owners (required to bind columns)
        parsedMapping && parsedMapping.source.credential
          ? {
              create: {
                host: '',
                port: '',
                database: '',
                password: '',
                login: '',
                model: parsedMapping.source.credential.model,
                owners: {
                  create: parsedMapping.source.credential.owners.map(
                    (o: any) => ({
                      name: o.name,
                      schema: o.schema,
                    }),
                  ) as Owner[],
                },
              },
            }
          : undefined,
    },
    include: { credential: { include: { owners: true } } },
  })

  // create a row in ACL
  await ctx.prisma.accessControl.create({
    data: {
      user: { connect: { id: ctx.user!.id } },
      source: { connect: { id: source.id } },
      role: 'WRITER',
    },
  })

  // import mapping if present
  if (parsedMapping) {
    await ctx.prisma.$transaction(
      await importMapping(ctx.prisma, source, parsedMapping),
    )
  }

  return source
}

export const deleteSource: FieldResolver<'Mutation', 'deleteSource'> = async (
  _parent,
  { sourceId },
  ctx,
) => {
  const source = await ctx.prisma.source.findUnique({
    where: { id: sourceId },
    include: {
      credential: {
        include: { owners: true },
      },
      resources: {
        include: {
          filters: {
            include: {
              sqlColumn: true,
            },
          },
          attributes: {
            include: {
              inputGroups: {
                include: {
                  inputs: {
                    include: {
                      sqlValue: {
                        include: {
                          joins: {
                            include: {
                              tables: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  conditions: {
                    include: { sqlValue: true },
                  },
                },
              },
              comments: true,
            },
          },
        },
      },
    },
  })
  await ctx.prisma.accessControl.deleteMany({
    where: { source: { id: sourceId } },
  })
  await Promise.all(
    source!.resources.map(async r => {
      await Promise.all(
        r.filters.map(async f => {
          await ctx.prisma.filter.delete({ where: { id: f.id } })
          ctx.prisma.column.delete({ where: { id: f.sqlColumn.id } })
        }),
      )
      await Promise.all(
        r.attributes.map(async a => {
          await Promise.all(
            a.inputGroups.map(async g => {
              await Promise.all([
                ...g.inputs.map(async i => {
                  if (i.sqlValue) {
                    await Promise.all([
                      ...i.sqlValue.joins.map(async j => {
                        await Promise.all(
                          j.tables.map(t =>
                            ctx.prisma.column.delete({
                              where: { id: t.id },
                            }),
                          ),
                        )
                        return ctx.prisma.join.delete({
                          where: { id: j.id },
                        })
                      }),
                    ])
                    await ctx.prisma.column.delete({
                      where: { id: i.sqlValue.id },
                    })
                  }
                  return ctx.prisma.input.delete({ where: { id: i.id } })
                }),
                ...g.conditions.map(async c => {
                  if (c.sqlValue)
                    ctx.prisma.column.delete({ where: { id: c.sqlValue.id } })
                  return ctx.prisma.condition.delete({ where: { id: c.id } })
                }),
                ...a.comments.map(async c =>
                  ctx.prisma.comment.delete({
                    where: { id: c.id },
                  }),
                ),
              ] as Promise<Comment | Condition | Input>[])
              return ctx.prisma.inputGroup.delete({ where: { id: g.id } })
            }),
          )
          return ctx.prisma.attribute.delete({ where: { id: a.id } })
        }),
      )
      return ctx.prisma.resource.delete({ where: { id: r.id } })
    }),
  )
  if (source!.credential) {
    await ctx.prisma.column.deleteMany({
      where: { ownerId: { in: source!.credential.owners.map(o => o.id) } },
    })
    await ctx.prisma.owner.deleteMany({
      where: { credentialId: source!.credential.id },
    })
    await ctx.prisma.credential.delete({
      where: { id: source!.credential.id },
    })
  }

  return ctx.prisma.source.delete({ where: { id: sourceId } })
}

const usedConceptMaps: FieldResolver<'Source', 'usedConceptMapIds'> = async (
  parent,
  _,
  ctx,
) => {
  const sourceWithMapIds = await ctx.prisma.source.findUnique({
    where: { id: parent.id },
    include: {
      resources: {
        include: {
          attributes: {
            include: {
              inputGroups: {
                include: {
                  inputs: true,
                },
              },
            },
          },
        },
      },
    },
  })
  const resources = sourceWithMapIds!.resources as ResourceWithAttributes[]

  const reduceInputGroups = (acc: string[], curGroup: InputGroupWithInputs) => [
    ...acc,
    ...(curGroup.inputs
      .map(input => input.conceptMapId)
      .filter(Boolean) as string[]),
  ]

  const reduceAttributes = (
    acc: string[],
    curAttribute: AttributeWithInputGroups,
  ) => [...acc, ...curAttribute.inputGroups.reduce(reduceInputGroups, [])]

  const reduceResources = (
    acc: string[],
    curResource: ResourceWithAttributes,
  ) => [...acc, ...curResource.attributes.reduce(reduceAttributes, [])]

  return resources.reduce(reduceResources, [])
}

const usedProfiles: FieldResolver<'Source', 'usedProfileIds'> = async (
  parent,
  _,
  ctx,
) => {
  const resources = await ctx.prisma.resource.findMany({
    where: { source: { id: parent.id } },
  })

  const definitions = await Promise.all(
    resources.map(r => getDefinition(r.definitionId)),
  )

  const profileIds = definitions
    .filter(def => !!def && def.meta.derivation === 'constraint')
    .map(def => def!.meta.id)

  // Remove duplicates
  return profileIds.filter((id, index) => profileIds.indexOf(id) === index)
}
