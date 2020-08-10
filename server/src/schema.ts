import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema'
import { makeSchema } from '@nexus/schema'

import * as resolvers from 'resolvers'

export const schema = makeSchema({
  types: resolvers,
  plugins: [nexusSchemaPrisma()],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
    contextType: 'Context.Context',
  },
})
