/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as Context from '../context'
import * as photon from '@prisma/photon'

declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {}

export interface NexusGenEnums {
  DatabaseType: photon.DatabaseType
  Role: photon.Role
}

export interface NexusGenRootTypes {
  Attribute: photon.Attribute
  AuthPayload: {
    // root type
    token: string // String!
    user: NexusGenRootTypes['User'] // User!
  }
  Credential: photon.Credential
  InputColumn: photon.InputColumn
  Join: photon.Join
  Mutation: {}
  Query: {}
  Resource: photon.Resource
  Source: photon.Source
  User: photon.User
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  DatabaseType: NexusGenEnums['DatabaseType']
  Role: NexusGenEnums['Role']
}

export interface NexusGenFieldTypes {
  Attribute: {
    // field return type
    attribute: NexusGenRootTypes['Attribute'] | null // Attribute
    attributes: NexusGenRootTypes['Attribute'][] // [Attribute!]!
    comment: string | null // String
    createdAt: any // DateTime!
    depth: number | null // Int
    id: string // ID!
    inputColumns: NexusGenRootTypes['InputColumn'][] // [InputColumn!]!
    isProfile: boolean | null // Boolean
    mergingScript: string | null // String
    model: string | null // String
    name: string // String!
    resource: NexusGenRootTypes['Resource'] | null // Resource
    updatedAt: any // DateTime!
  }
  AuthPayload: {
    // field return type
    token: string // String!
    user: NexusGenRootTypes['User'] // User!
  }
  Credential: {
    // field return type
    database: string // String!
    host: string // String!
    id: string // ID!
    login: string // String!
    model: NexusGenEnums['DatabaseType'] // DatabaseType!
    password: string // String!
    port: string // String!
    source: NexusGenRootTypes['Source'] // Source!
  }
  InputColumn: {
    // field return type
    attribute: NexusGenRootTypes['Attribute'] // Attribute!
    column: string // String!
    createdAt: any // DateTime!
    id: string // ID!
    joins: NexusGenRootTypes['Join'][] // [Join!]!
    owner: string // String!
    script: string // String!
    staticValue: string // String!
    table: string // String!
    updatedAt: any // DateTime!
  }
  Join: {
    // field return type
    createdAt: any // DateTime!
    id: string // ID!
    inputColumn: NexusGenRootTypes['InputColumn'] // InputColumn!
    sourceColumn: string // String!
    sourceOwner: string // String!
    sourceTable: string // String!
    targetColumn: string // String!
    targetOwner: string // String!
    targetTable: string // String!
    updatedAt: any // DateTime!
  }
  Mutation: {
    // field return type
    createResource: NexusGenRootTypes['Resource'] // Resource!
    createSource: NexusGenRootTypes['Source'] // Source!
    deleteResource: NexusGenRootTypes['Resource'] // Resource!
    deleteSource: NexusGenRootTypes['Source'] // Source!
    login: NexusGenRootTypes['AuthPayload'] // AuthPayload!
    signup: NexusGenRootTypes['AuthPayload'] // AuthPayload!
  }
  Query: {
    // field return type
    attribute: NexusGenRootTypes['Attribute'] | null // Attribute
    me: NexusGenRootTypes['User'] | null // User
    resource: NexusGenRootTypes['Resource'] | null // Resource
    source: NexusGenRootTypes['Source'] | null // Source
    sources: NexusGenRootTypes['Source'][] | null // [Source!]
  }
  Resource: {
    // field return type
    attributes: NexusGenRootTypes['Attribute'][] // [Attribute!]!
    createdAt: any // DateTime!
    fhirType: string // String!
    id: string // ID!
    label: string | null // String
    primaryKeyColumn: string | null // String
    primaryKeyOwner: string | null // String
    primaryKeyTable: string | null // String
    source: NexusGenRootTypes['Source'] // Source!
    updatedAt: any // DateTime!
  }
  Source: {
    // field return type
    createdAt: any // DateTime!
    credential: NexusGenRootTypes['Credential'] | null // Credential
    hasOwner: boolean // Boolean!
    id: string // ID!
    mappingProgress: number[] | null // [Int!]
    name: string // String!
    resources: NexusGenRootTypes['Resource'][] // [Resource!]!
    updatedAt: any // DateTime!
  }
  User: {
    // field return type
    createdAt: any // DateTime!
    credentials: NexusGenRootTypes['Credential'][] // [Credential!]!
    email: string // String!
    id: string // ID!
    name: string // String!
    password: string // String!
    role: NexusGenEnums['Role'] // Role!
    updatedAt: any // DateTime!
  }
}

export interface NexusGenArgTypes {
  Attribute: {
    attributes: {
      // args
      after?: string | null // ID
      before?: string | null // ID
      first?: number | null // Int
      last?: number | null // Int
      skip?: number | null // Int
    }
    inputColumns: {
      // args
      after?: string | null // ID
      before?: string | null // ID
      first?: number | null // Int
      last?: number | null // Int
      skip?: number | null // Int
    }
  }
  InputColumn: {
    joins: {
      // args
      after?: string | null // ID
      before?: string | null // ID
      first?: number | null // Int
      last?: number | null // Int
      skip?: number | null // Int
    }
  }
  Mutation: {
    createResource: {
      // args
      resourceName: string // String!
      sourceId: string // ID!
    }
    createSource: {
      // args
      hasOwner: boolean // Boolean!
      name: string // String!
    }
    deleteResource: {
      // args
      resourceId: string // ID!
    }
    deleteSource: {
      // args
      name: string // String!
    }
    login: {
      // args
      email: string // String!
      password: string // String!
    }
    signup: {
      // args
      email: string // String!
      name: string // String!
      password: string // String!
    }
  }
  Query: {
    attribute: {
      // args
      attributeId: string // ID!
    }
    resource: {
      // args
      resourceId: string // ID!
    }
    source: {
      // args
      sourceId: string // ID!
    }
  }
  Resource: {
    attributes: {
      // args
      after?: string | null // ID
      before?: string | null // ID
      first?: number | null // Int
      last?: number | null // Int
      skip?: number | null // Int
    }
  }
  Source: {
    resources: {
      // args
      after?: string | null // ID
      before?: string | null // ID
      first?: number | null // Int
      last?: number | null // Int
      skip?: number | null // Int
    }
  }
  User: {
    credentials: {
      // args
      after?: string | null // ID
      before?: string | null // ID
      first?: number | null // Int
      last?: number | null // Int
      skip?: number | null // Int
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames =
  | 'Attribute'
  | 'AuthPayload'
  | 'Credential'
  | 'InputColumn'
  | 'Join'
  | 'Mutation'
  | 'Query'
  | 'Resource'
  | 'Source'
  | 'User'

export type NexusGenInputNames = never

export type NexusGenEnumNames = 'DatabaseType' | 'Role'

export type NexusGenInterfaceNames = never

export type NexusGenScalarNames =
  | 'Boolean'
  | 'DateTime'
  | 'Float'
  | 'ID'
  | 'Int'
  | 'String'

export type NexusGenUnionNames = never

export interface NexusGenTypes {
  context: Context.Context
  inputTypes: NexusGenInputs
  rootTypes: NexusGenRootTypes
  argTypes: NexusGenArgTypes
  fieldTypes: NexusGenFieldTypes
  allTypes: NexusGenAllTypes
  inheritedFields: NexusGenInheritedFields
  objectNames: NexusGenObjectNames
  inputNames: NexusGenInputNames
  enumNames: NexusGenEnumNames
  interfaceNames: NexusGenInterfaceNames
  scalarNames: NexusGenScalarNames
  unionNames: NexusGenUnionNames
  allInputTypes:
    | NexusGenTypes['inputNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['scalarNames']
  allOutputTypes:
    | NexusGenTypes['objectNames']
    | NexusGenTypes['enumNames']
    | NexusGenTypes['unionNames']
    | NexusGenTypes['interfaceNames']
    | NexusGenTypes['scalarNames']
  allNamedTypes:
    | NexusGenTypes['allInputTypes']
    | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames']
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes
}

declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {}
  interface NexusGenPluginFieldConfig<
    TypeName extends string,
    FieldName extends string
  > {}
  interface NexusGenPluginSchemaConfig {}
}
