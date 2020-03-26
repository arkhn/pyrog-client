import { objectType, FieldResolver } from 'nexus'

import axios from 'axios'

import { FHIR_API_URL } from '../constants'

export const Input = objectType({
  name: 'Input',
  definition(t) {
    t.model.id()

    t.model.sqlValue()
    t.model.script()
    t.model.staticValue()

    t.model.conceptMapId()
    t.field('conceptMap', {
      type: 'ConceptMap',
      nullable: true,
      resolve: async (parent: any) => {
        if (!parent.conceptMapId) return null
        try {
          const response = await axios.get(
            `${FHIR_API_URL}/ConceptMap/${parent.conceptMapId}`,
          )
          return response.data
        } catch (err) {
          throw new Error(`Could not fetch concept map: ${err.response.data}`)
        }
      },
    })

    t.model.attribute()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const createInput: FieldResolver<'Mutation', 'createInput'> = async (
  _parent,
  { attributeId, script, static: staticValue, sql: sqlValue },
  ctx,
) => {
  if (!sqlValue && !staticValue) {
    throw new Error(`Input needs to have either a sql or static value`)
  } else if (sqlValue && staticValue) {
    throw new Error(`Input cannot have both a static and sql value`)
  }

  if (staticValue) {
    return ctx.prismaClient.input.create({
      data: {
        staticValue,
        script,
        attribute: {
          connect: {
            id: attributeId,
          },
        },
      },
    })
  }

  const joins = sqlValue!.joins
    ? await Promise.all(
        sqlValue!.joins.map(j =>
          ctx.prismaClient.join.create({
            include: { tables: true },
            data: {
              tables: {
                create: [
                  {
                    owner: j.source ? j.source.owner : '',
                    table: j.source ? j.source.table : '',
                    column: j.source ? j.source.column : '',
                  },
                  {
                    owner: j.target ? j.target.owner : '',
                    table: j.target ? j.target.table : '',
                    column: j.target ? j.target.column : '',
                  },
                ],
              },
            },
          }),
        ),
      )
    : []
  return ctx.prismaClient.input.create({
    data: {
      sqlValue: {
        create: {
          owner: sqlValue!.owner,
          table: sqlValue!.table,
          column: sqlValue!.column,
          joins: {
            connect: joins.map(j => ({ id: j.id })),
          },
        },
      },
      script,
      attribute: {
        connect: {
          id: attributeId,
        },
      },
    },
  })
}

export const deleteInput: FieldResolver<'Mutation', 'deleteInput'> = async (
  _parent,
  { inputId },
  ctx,
) => ctx.prismaClient.input.delete({ where: { id: inputId } })

export const updateInput: FieldResolver<'Mutation', 'updateInput'> = async (
  _parent,
  { inputId, data },
  ctx,
) => {
  return ctx.prismaClient.input.update({
    where: { id: inputId },
    data,
  })
}
