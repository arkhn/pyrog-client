import { objectType, FieldResolver } from 'nexus'

export const Column = objectType({
  name: 'Column',
  definition(t) {
    t.model.id()

    t.model.owner()
    t.model.table()
    t.model.column()

    t.model.joins()

    t.model.updatedAt()
    t.model.createdAt()
  },
})

export const updateColumn: FieldResolver<'Mutation', 'updateColumn'> = async (
  _parent,
  { columnId, data },
  ctx,
) =>
  ctx.prisma.column.update({
    where: { id: columnId },
    data: {
      column: data.column,
      table: data.table,
      owner: data.owner
        ? {
            connect: { id: data.owner.id },
          }
        : undefined,
    },
  })

export const addJoinToColumn: FieldResolver<
  'Mutation',
  'addJoinToColumn'
> = async (_parent, { columnId, join }, ctx) => {
  const newJoin = await ctx.prisma.join.create({
    data: {
      tables: {
        create: [
          {
            owner:
              join.tables && join.tables[0].owner
                ? {
                    connect: {
                      id: join.tables[0].owner.id,
                    },
                  }
                : undefined,
            table: join.tables && join.tables[0].table,
            column: join.tables && join.tables[0].column,
          },
          {
            owner:
              join.tables && join.tables[1].owner
                ? {
                    connect: {
                      id: join.tables[1].owner.id,
                    },
                  }
                : undefined,
            table: join.tables && join.tables[1].table,
            column: join.tables && join.tables[1].column,
          },
        ],
      },
    },
  })

  return ctx.prisma.column.update({
    where: { id: columnId },
    data: {
      joins: {
        connect: { id: newJoin.id },
      },
    },
  })
}
