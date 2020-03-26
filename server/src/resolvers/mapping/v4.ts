import { PrismaClient, Resource } from '@prisma/client'

import { clean, buildAttributesQuery } from './utils'

const cleanResourceV4 = (resource: Resource) => {
  const r = clean(resource)
  delete r.definition
  delete r.source
  return r
}

export default (
  prismaClient: PrismaClient,
  sourceId: string,
  resources: any[],
) =>
  Promise.all(
    resources.map(async (r: any) => {
      return prismaClient.resource.create({
        data: {
          ...cleanResourceV4(r),
          attributes: {
            create: buildAttributesQuery(r.attributes),
          },
          source: {
            connect: { id: sourceId },
          },
        },
      })
    }),
  )
