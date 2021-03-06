import { objectType, FieldResolver } from 'nexus'

export const Join = objectType({
  name: 'Join',
  definition(t) {
    t.model.id()

    t.model.tables()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const updateJoin: FieldResolver<'Mutation', 'updateJoin'> = async (
  _parent,
  { joinId, data },
  ctx,
) => {
  if (!data) {
    throw new Error('Update payload cannot be null')
  }

  const join = await ctx.prisma.join.findUnique({
    where: { id: joinId },
    include: { tables: true },
  })

  return ctx.prisma.join.update({
    where: { id: joinId },
    data: {
      tables: {
        update: [
          {
            where: { id: join!.tables[0].id },
            data: {
              owner:
                data.tables && data.tables[0].owner
                  ? {
                      connect: {
                        id: data.tables[0].owner.id,
                      },
                    }
                  : undefined,
              table: data.tables && data.tables[0].table,
              column: data.tables && data.tables[0].column,
            },
          },
          {
            where: { id: join!.tables[1].id },
            data: {
              owner:
                data.tables && data.tables[1].owner
                  ? {
                      connect: {
                        id: data.tables[1].owner.id,
                      },
                    }
                  : undefined,
              table: data.tables && data.tables[1].table,
              column: data.tables && data.tables[1].column,
            },
          },
        ],
      },
    },
  })
}

export const deleteJoin: FieldResolver<'Mutation', 'deleteJoin'> = async (
  _parent,
  { joinId },
  ctx,
) => ctx.prisma.join.delete({ where: { id: joinId } })
