/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */

import * as Context from "../context"
import * as photon from "@prisma/photon"
import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    JSON<FieldName extends string>(fieldName: FieldName, opts?: core.ScalarInputFieldConfig<core.GetGen3<"inputTypes", TypeName, FieldName>>): void // "JSON";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    JSON<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
  }
}
declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    crud: NexusPrisma<TypeName, 'crud'>
    model: NexusPrisma<TypeName, 'model'>
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  AttributeFilter: { // input type
    every?: NexusGenInputs['AttributeWhereInput'] | null; // AttributeWhereInput
    none?: NexusGenInputs['AttributeWhereInput'] | null; // AttributeWhereInput
    some?: NexusGenInputs['AttributeWhereInput'] | null; // AttributeWhereInput
  }
  AttributeInput: { // input type
    comments?: string | null; // String
    mergingScript?: string | null; // String
  }
  AttributeWhereInput: { // input type
    AND?: NexusGenInputs['AttributeWhereInput'][] | null; // [AttributeWhereInput!]
    comments?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    inputs?: NexusGenInputs['InputFilter'] | null; // InputFilter
    mergingScript?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    NOT?: NexusGenInputs['AttributeWhereInput'][] | null; // [AttributeWhereInput!]
    OR?: NexusGenInputs['AttributeWhereInput'][] | null; // [AttributeWhereInput!]
    path?: NexusGenInputs['StringFilter'] | null; // StringFilter
    resource?: NexusGenInputs['ResourceWhereInput'] | null; // ResourceWhereInput
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  BooleanFilter: { // input type
    equals?: boolean | null; // Boolean
    not?: boolean | null; // Boolean
  }
  ColumnFilter: { // input type
    every?: NexusGenInputs['ColumnWhereInput'] | null; // ColumnWhereInput
    none?: NexusGenInputs['ColumnWhereInput'] | null; // ColumnWhereInput
    some?: NexusGenInputs['ColumnWhereInput'] | null; // ColumnWhereInput
  }
  ColumnInput: { // input type
    column: string; // String!
    joins?: NexusGenInputs['JoinInput'][] | null; // [JoinInput!]
    owner: string; // String!
    table: string; // String!
  }
  ColumnInputWithoutJoins: { // input type
    column?: string | null; // String
    owner?: string | null; // String
    table?: string | null; // String
  }
  ColumnWhereInput: { // input type
    AND?: NexusGenInputs['ColumnWhereInput'][] | null; // [ColumnWhereInput!]
    column?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    inputs?: NexusGenInputs['InputFilter'] | null; // InputFilter
    join?: NexusGenInputs['JoinWhereInput'] | null; // JoinWhereInput
    joins?: NexusGenInputs['JoinFilter'] | null; // JoinFilter
    NOT?: NexusGenInputs['ColumnWhereInput'][] | null; // [ColumnWhereInput!]
    OR?: NexusGenInputs['ColumnWhereInput'][] | null; // [ColumnWhereInput!]
    owner?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    table?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  CredentialWhereInput: { // input type
    AND?: NexusGenInputs['CredentialWhereInput'][] | null; // [CredentialWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    database?: NexusGenInputs['StringFilter'] | null; // StringFilter
    host?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    login?: NexusGenInputs['StringFilter'] | null; // StringFilter
    model?: NexusGenEnums['DatabaseType'] | null; // DatabaseType
    NOT?: NexusGenInputs['CredentialWhereInput'][] | null; // [CredentialWhereInput!]
    OR?: NexusGenInputs['CredentialWhereInput'][] | null; // [CredentialWhereInput!]
    password?: NexusGenInputs['StringFilter'] | null; // StringFilter
    port?: NexusGenInputs['StringFilter'] | null; // StringFilter
    source?: NexusGenInputs['SourceWhereInput'] | null; // SourceWhereInput
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  DateTimeFilter: { // input type
    equals?: any | null; // DateTime
    gt?: any | null; // DateTime
    gte?: any | null; // DateTime
    in?: any[] | null; // [DateTime!]
    lt?: any | null; // DateTime
    lte?: any | null; // DateTime
    not?: any | null; // DateTime
    notIn?: any[] | null; // [DateTime!]
  }
  InputFilter: { // input type
    every?: NexusGenInputs['InputWhereInput'] | null; // InputWhereInput
    none?: NexusGenInputs['InputWhereInput'] | null; // InputWhereInput
    some?: NexusGenInputs['InputWhereInput'] | null; // InputWhereInput
  }
  InputWhereInput: { // input type
    AND?: NexusGenInputs['InputWhereInput'][] | null; // [InputWhereInput!]
    attribute?: NexusGenInputs['AttributeWhereInput'] | null; // AttributeWhereInput
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['InputWhereInput'][] | null; // [InputWhereInput!]
    OR?: NexusGenInputs['InputWhereInput'][] | null; // [InputWhereInput!]
    script?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    sqlValue?: NexusGenInputs['ColumnWhereInput'] | null; // ColumnWhereInput
    staticValue?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  JoinFilter: { // input type
    every?: NexusGenInputs['JoinWhereInput'] | null; // JoinWhereInput
    none?: NexusGenInputs['JoinWhereInput'] | null; // JoinWhereInput
    some?: NexusGenInputs['JoinWhereInput'] | null; // JoinWhereInput
  }
  JoinInput: { // input type
    source?: NexusGenInputs['ColumnInputWithoutJoins'] | null; // ColumnInputWithoutJoins
    target?: NexusGenInputs['ColumnInputWithoutJoins'] | null; // ColumnInputWithoutJoins
  }
  JoinWhereInput: { // input type
    AND?: NexusGenInputs['JoinWhereInput'][] | null; // [JoinWhereInput!]
    column?: NexusGenInputs['ColumnWhereInput'] | null; // ColumnWhereInput
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['JoinWhereInput'][] | null; // [JoinWhereInput!]
    OR?: NexusGenInputs['JoinWhereInput'][] | null; // [JoinWhereInput!]
    tables?: NexusGenInputs['ColumnFilter'] | null; // ColumnFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  NullableStringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: string | null; // String
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  ResourceFilter: { // input type
    every?: NexusGenInputs['ResourceWhereInput'] | null; // ResourceWhereInput
    none?: NexusGenInputs['ResourceWhereInput'] | null; // ResourceWhereInput
    some?: NexusGenInputs['ResourceWhereInput'] | null; // ResourceWhereInput
  }
  ResourceWhereInput: { // input type
    AND?: NexusGenInputs['ResourceWhereInput'][] | null; // [ResourceWhereInput!]
    attributes?: NexusGenInputs['AttributeFilter'] | null; // AttributeFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    definitionId?: NexusGenInputs['StringFilter'] | null; // StringFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    label?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    NOT?: NexusGenInputs['ResourceWhereInput'][] | null; // [ResourceWhereInput!]
    OR?: NexusGenInputs['ResourceWhereInput'][] | null; // [ResourceWhereInput!]
    primaryKeyColumn?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    primaryKeyOwner?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    primaryKeyTable?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
    source?: NexusGenInputs['SourceWhereInput'] | null; // SourceWhereInput
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  SourceFilter: { // input type
    every?: NexusGenInputs['SourceWhereInput'] | null; // SourceWhereInput
    none?: NexusGenInputs['SourceWhereInput'] | null; // SourceWhereInput
    some?: NexusGenInputs['SourceWhereInput'] | null; // SourceWhereInput
  }
  SourceWhereInput: { // input type
    AND?: NexusGenInputs['SourceWhereInput'][] | null; // [SourceWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    credential?: NexusGenInputs['CredentialWhereInput'] | null; // CredentialWhereInput
    hasOwner?: NexusGenInputs['BooleanFilter'] | null; // BooleanFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['SourceWhereInput'][] | null; // [SourceWhereInput!]
    OR?: NexusGenInputs['SourceWhereInput'][] | null; // [SourceWhereInput!]
    resources?: NexusGenInputs['ResourceFilter'] | null; // ResourceFilter
    template?: NexusGenInputs['TemplateWhereInput'] | null; // TemplateWhereInput
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    version?: NexusGenInputs['NullableStringFilter'] | null; // NullableStringFilter
  }
  StringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: string[] | null; // [String!]
    lt?: string | null; // String
    lte?: string | null; // String
    not?: string | null; // String
    notIn?: string[] | null; // [String!]
    startsWith?: string | null; // String
  }
  StructureDefinitionWhereFilter: { // input type
    derivation?: string | null; // String
    kind?: string | null; // String
    type?: string | null; // String
  }
  TemplateWhereInput: { // input type
    AND?: NexusGenInputs['TemplateWhereInput'][] | null; // [TemplateWhereInput!]
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    id?: NexusGenInputs['StringFilter'] | null; // StringFilter
    name?: NexusGenInputs['StringFilter'] | null; // StringFilter
    NOT?: NexusGenInputs['TemplateWhereInput'][] | null; // [TemplateWhereInput!]
    OR?: NexusGenInputs['TemplateWhereInput'][] | null; // [TemplateWhereInput!]
    sources?: NexusGenInputs['SourceFilter'] | null; // SourceFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
  }
  UpdateInputInput: { // input type
    script?: string | null; // String
  }
  UpdateResourceInput: { // input type
    label?: string | null; // String
    primaryKeyColumn?: string | null; // String
    primaryKeyOwner?: string | null; // String
    primaryKeyTable?: string | null; // String
  }
}

export interface NexusGenEnums {
  DatabaseType: photon.DatabaseType
  Role: photon.Role
}

export interface NexusGenRootTypes {
  Attribute: photon.Attribute;
  AuthPayload: { // root type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Column: photon.Column;
  Credential: photon.Credential;
  Input: photon.Input;
  Join: photon.Join;
  Mutation: {};
  Query: {};
  Resource: photon.Resource;
  Source: photon.Source;
  StructureDefinition: {};
  Template: photon.Template;
  User: photon.User;
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
  DateTime: any;
  JSON: any;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  AttributeFilter: NexusGenInputs['AttributeFilter'];
  AttributeInput: NexusGenInputs['AttributeInput'];
  AttributeWhereInput: NexusGenInputs['AttributeWhereInput'];
  BooleanFilter: NexusGenInputs['BooleanFilter'];
  ColumnFilter: NexusGenInputs['ColumnFilter'];
  ColumnInput: NexusGenInputs['ColumnInput'];
  ColumnInputWithoutJoins: NexusGenInputs['ColumnInputWithoutJoins'];
  ColumnWhereInput: NexusGenInputs['ColumnWhereInput'];
  CredentialWhereInput: NexusGenInputs['CredentialWhereInput'];
  DateTimeFilter: NexusGenInputs['DateTimeFilter'];
  InputFilter: NexusGenInputs['InputFilter'];
  InputWhereInput: NexusGenInputs['InputWhereInput'];
  JoinFilter: NexusGenInputs['JoinFilter'];
  JoinInput: NexusGenInputs['JoinInput'];
  JoinWhereInput: NexusGenInputs['JoinWhereInput'];
  NullableStringFilter: NexusGenInputs['NullableStringFilter'];
  ResourceFilter: NexusGenInputs['ResourceFilter'];
  ResourceWhereInput: NexusGenInputs['ResourceWhereInput'];
  SourceFilter: NexusGenInputs['SourceFilter'];
  SourceWhereInput: NexusGenInputs['SourceWhereInput'];
  StringFilter: NexusGenInputs['StringFilter'];
  StructureDefinitionWhereFilter: NexusGenInputs['StructureDefinitionWhereFilter'];
  TemplateWhereInput: NexusGenInputs['TemplateWhereInput'];
  UpdateInputInput: NexusGenInputs['UpdateInputInput'];
  UpdateResourceInput: NexusGenInputs['UpdateResourceInput'];
  DatabaseType: NexusGenEnums['DatabaseType'];
  Role: NexusGenEnums['Role'];
}

export interface NexusGenFieldTypes {
  Attribute: { // field return type
    comments: string | null; // String
    createdAt: any; // DateTime!
    id: string; // ID!
    inputs: NexusGenRootTypes['Input'][]; // [Input!]!
    mergingScript: string | null; // String
    path: string; // String!
    resource: NexusGenRootTypes['Resource'] | null; // Resource
    updatedAt: any; // DateTime!
  }
  AuthPayload: { // field return type
    token: string; // String!
    user: NexusGenRootTypes['User']; // User!
  }
  Column: { // field return type
    column: string | null; // String
    createdAt: any; // DateTime!
    id: string; // ID!
    joins: NexusGenRootTypes['Join'][]; // [Join!]!
    owner: string | null; // String
    table: string | null; // String
    updatedAt: any; // DateTime!
  }
  Credential: { // field return type
    createdAt: any; // DateTime!
    database: string; // String!
    host: string; // String!
    id: string; // ID!
    login: string; // String!
    model: NexusGenEnums['DatabaseType']; // DatabaseType!
    password: string; // String!
    port: string; // String!
    source: NexusGenRootTypes['Source']; // Source!
    updatedAt: any; // DateTime!
  }
  Input: { // field return type
    attribute: NexusGenRootTypes['Attribute']; // Attribute!
    createdAt: any; // DateTime!
    id: string; // ID!
    script: string | null; // String
    sqlValue: NexusGenRootTypes['Column'] | null; // Column
    staticValue: string | null; // String
    updatedAt: any; // DateTime!
  }
  Join: { // field return type
    createdAt: any; // DateTime!
    id: string; // ID!
    tables: NexusGenRootTypes['Column'][]; // [Column!]!
    updatedAt: any; // DateTime!
  }
  Mutation: { // field return type
    addJoinToColumn: NexusGenRootTypes['Column']; // Column!
    createAttribute: NexusGenRootTypes['Attribute']; // Attribute!
    createInput: NexusGenRootTypes['Input']; // Input!
    createResource: NexusGenRootTypes['Resource']; // Resource!
    createSource: NexusGenRootTypes['Source']; // Source!
    createTemplate: NexusGenRootTypes['Template']; // Template!
    deleteAttribute: NexusGenRootTypes['Attribute']; // Attribute!
    deleteAttributes: NexusGenRootTypes['Attribute'][] | null; // [Attribute!]
    deleteCredential: NexusGenRootTypes['Credential']; // Credential!
    deleteInput: NexusGenRootTypes['Input']; // Input!
    deleteJoin: NexusGenRootTypes['Join']; // Join!
    deleteResource: NexusGenRootTypes['Resource']; // Resource!
    deleteSource: NexusGenRootTypes['Source']; // Source!
    deleteTemplate: NexusGenRootTypes['Template']; // Template!
    login: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    refreshDefinition: NexusGenRootTypes['StructureDefinition']; // StructureDefinition!
    signup: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    updateAttribute: NexusGenRootTypes['Attribute']; // Attribute!
    updateInput: NexusGenRootTypes['Input']; // Input!
    updateJoin: NexusGenRootTypes['Join']; // Join!
    updateResource: NexusGenRootTypes['Resource']; // Resource!
    upsertCredential: NexusGenRootTypes['Credential']; // Credential!
  }
  Query: { // field return type
    attribute: NexusGenRootTypes['Attribute'] | null; // Attribute
    credential: NexusGenRootTypes['Credential'] | null; // Credential
    me: NexusGenRootTypes['User'] | null; // User
    resource: NexusGenRootTypes['Resource'] | null; // Resource
    resources: NexusGenRootTypes['Resource'][] | null; // [Resource!]
    source: NexusGenRootTypes['Source'] | null; // Source
    sources: NexusGenRootTypes['Source'][] | null; // [Source!]
    structureDefinition: NexusGenRootTypes['StructureDefinition'] | null; // StructureDefinition
    structureDefinitions: NexusGenRootTypes['StructureDefinition'][] | null; // [StructureDefinition!]
    template: NexusGenRootTypes['Template'] | null; // Template
    templates: NexusGenRootTypes['Template'][] | null; // [Template!]
  }
  Resource: { // field return type
    attributes: NexusGenRootTypes['Attribute'][]; // [Attribute!]!
    createdAt: any; // DateTime!
    definition: NexusGenRootTypes['StructureDefinition']; // StructureDefinition!
    definitionId: string; // String!
    id: string; // ID!
    label: string | null; // String
    primaryKeyColumn: string | null; // String
    primaryKeyOwner: string | null; // String
    primaryKeyTable: string | null; // String
    source: NexusGenRootTypes['Source']; // Source!
    updatedAt: any; // DateTime!
  }
  Source: { // field return type
    createdAt: any; // DateTime!
    credential: NexusGenRootTypes['Credential'] | null; // Credential
    hasOwner: boolean; // Boolean!
    id: string; // ID!
    mapping: string; // String!
    mappingProgress: number[] | null; // [Int!]
    name: string; // String!
    resources: NexusGenRootTypes['Resource'][]; // [Resource!]!
    template: NexusGenRootTypes['Template']; // Template!
    updatedAt: any; // DateTime!
    version: string | null; // String
  }
  StructureDefinition: { // field return type
    display: any; // JSON!
    id: string; // String!
    name: string; // String!
    profiles: NexusGenRootTypes['StructureDefinition'][]; // [StructureDefinition!]!
    publisher: string; // String!
    type: string; // String!
  }
  Template: { // field return type
    createdAt: any; // DateTime!
    id: string; // ID!
    name: string; // String!
    sources: NexusGenRootTypes['Source'][]; // [Source!]!
    updatedAt: any; // DateTime!
  }
  User: { // field return type
    createdAt: any; // DateTime!
    email: string; // String!
    id: string; // ID!
    name: string; // String!
    role: NexusGenEnums['Role']; // Role!
    updatedAt: any; // DateTime!
  }
}

export interface NexusGenArgTypes {
  Attribute: {
    inputs: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Column: {
    joins: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Join: {
    tables: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Mutation: {
    addJoinToColumn: { // args
      columnId: string; // ID!
      join?: NexusGenInputs['JoinInput'] | null; // JoinInput
    }
    createAttribute: { // args
      data?: NexusGenInputs['AttributeInput'] | null; // AttributeInput
      path: string; // String!
      resourceId: string; // ID!
    }
    createInput: { // args
      attributeId: string; // ID!
      script?: string | null; // String
      sql?: NexusGenInputs['ColumnInput'] | null; // ColumnInput
      static?: string | null; // String
    }
    createResource: { // args
      definitionId: string; // String!
      sourceId: string; // ID!
    }
    createSource: { // args
      hasOwner: boolean; // Boolean!
      mapping?: string | null; // String
      name: string; // String!
      templateName: string; // String!
    }
    createTemplate: { // args
      name: string; // String!
    }
    deleteAttribute: { // args
      id: string; // ID!
    }
    deleteAttributes: { // args
      filter?: NexusGenInputs['AttributeWhereInput'] | null; // AttributeWhereInput
    }
    deleteCredential: { // args
      id: string; // ID!
    }
    deleteInput: { // args
      id: string; // ID!
    }
    deleteJoin: { // args
      id: string; // ID!
    }
    deleteResource: { // args
      id: string; // ID!
    }
    deleteSource: { // args
      id: string; // ID!
    }
    deleteTemplate: { // args
      id: string; // ID!
    }
    login: { // args
      email: string; // String!
      password: string; // String!
    }
    refreshDefinition: { // args
      definitionId: string; // ID!
    }
    signup: { // args
      email: string; // String!
      name: string; // String!
      password: string; // String!
    }
    updateAttribute: { // args
      attributeId: string; // ID!
      data: NexusGenInputs['AttributeInput']; // AttributeInput!
    }
    updateInput: { // args
      data: NexusGenInputs['UpdateInputInput']; // UpdateInputInput!
      inputId: string; // ID!
    }
    updateJoin: { // args
      data: NexusGenInputs['JoinInput']; // JoinInput!
      joinId: string; // ID!
    }
    updateResource: { // args
      data: NexusGenInputs['UpdateResourceInput']; // UpdateResourceInput!
      resourceId: string; // ID!
    }
    upsertCredential: { // args
      database: string; // String!
      host: string; // String!
      login: string; // String!
      model: string; // String!
      password: string; // String!
      port: string; // String!
      sourceId: string; // ID!
    }
  }
  Query: {
    attribute: { // args
      attributeId: string; // ID!
    }
    credential: { // args
      credentialId: string; // ID!
    }
    resource: { // args
      resourceId: string; // ID!
    }
    resources: { // args
      filter?: NexusGenInputs['ResourceWhereInput'] | null; // ResourceWhereInput
    }
    source: { // args
      sourceId: string; // ID!
    }
    structureDefinition: { // args
      definitionId: string; // ID!
    }
    structureDefinitions: { // args
      filter: NexusGenInputs['StructureDefinitionWhereFilter']; // StructureDefinitionWhereFilter!
    }
    template: { // args
      templateId: string; // ID!
    }
  }
  Resource: {
    attributes: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
  Source: {
    resources: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
      where?: NexusGenInputs['ResourceWhereInput'] | null; // ResourceWhereInput
    }
  }
  Template: {
    sources: { // args
      after?: string | null; // ID
      before?: string | null; // ID
      first?: number | null; // Int
      last?: number | null; // Int
      skip?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Attribute" | "AuthPayload" | "Column" | "Credential" | "Input" | "Join" | "Mutation" | "Query" | "Resource" | "Source" | "StructureDefinition" | "Template" | "User";

export type NexusGenInputNames = "AttributeFilter" | "AttributeInput" | "AttributeWhereInput" | "BooleanFilter" | "ColumnFilter" | "ColumnInput" | "ColumnInputWithoutJoins" | "ColumnWhereInput" | "CredentialWhereInput" | "DateTimeFilter" | "InputFilter" | "InputWhereInput" | "JoinFilter" | "JoinInput" | "JoinWhereInput" | "NullableStringFilter" | "ResourceFilter" | "ResourceWhereInput" | "SourceFilter" | "SourceWhereInput" | "StringFilter" | "StructureDefinitionWhereFilter" | "TemplateWhereInput" | "UpdateInputInput" | "UpdateResourceInput";

export type NexusGenEnumNames = "DatabaseType" | "Role";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "DateTime" | "Float" | "ID" | "Int" | "JSON" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: Context.Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}