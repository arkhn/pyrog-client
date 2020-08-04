import { PrismaClient } from '@prisma/client'

import {
  cleanResource,
  checkAuthors,
  buildFiltersQuery,
  buildAttributesQuery,
} from './utils'

export default async (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: any[],
) => {
  await checkAuthors(prismaClient, resources)
  return Promise.all(
    resources.map(async (r: any) => {
      return prismaClient.resource.create({
        data: {
          ...cleanResource(r),
          attributes: {
            create: buildAttributesQuery(r.attributes),
          },
          filters: {
            create: buildFiltersQuery(r.filters),
          },
          source: {
            connect: { id: sourceId },
          },
        },
      })
    }),
  )
}
