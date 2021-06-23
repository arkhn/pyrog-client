import * as redux from 'redux';
import {
  Attribute,
  AttributeDefinition,
  ResourceDefinition
} from '@arkhn/fhir.ts';

// REDUX
export interface ISimpleAction {
  type: string;
  payload?: any;
}

export type IThunkAction = (
  dispatch: redux.Dispatch<any>,
  getState: any
) => void;

export type IAction = ISimpleAction | IThunkAction | Promise<any>;

// Reducers
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type ISourceRole = 'READER' | 'WRITER';

export interface IAttribute {
  id: string;
  path: string;
  sliceName: string;
  definitionId: string;
  inputGroups: IInputGroup[];
  comments: IComment[];
}
export interface IAttributeDefinition {
  attribute: AttributeDefinition;
  extensions?: IStructureDefinition[];
}
export interface IStructureDefinition {
  id: string;
  attributes: IAttributeDefinition[];
  extensions?: IStructureDefinition[];
}

export interface ISelectedSource {
  id: string;
  name: string;
  mappingProgress: number[];
  template: {
    name: string;
  };
  credential: ICredential;
  accessControls: IAccessControl[];
  resources: Resource[];
}

export interface Owner {
  id: string;
  name: string;
  schema: ISourceSchema;
}

export interface SerializedOwner {
  id: string;
  name: string;
  schema: string;
}

export interface ICredential {
  id: string;
  host: string;
  port: string;
  database: string;
  model: string;
  login: string;
  decryptedPassword: string;
  owners: Owner[];
}

export interface IAccessControl {
  id: string;
  user: IUser;
  role: ISourceRole;
  __typename: 'AccessControl';
}

export interface Resource {
  id: string;
  label: string;
  logicalReference: string;
  name: string;
  type: string;
  primaryKeyOwner: Owner;
  primaryKeyTable: string;
  primaryKeyColumn: string;
  filters: Filter[];
  definitionId: string;
  definition: {
    id: string;
    type: string;
    name: string;
  };
}

export interface IInputGroup {
  id: string;
  attributeId: string;
  inputs: IInput[];
  conditions: Condition[];
  mergingScript: string;
}

export interface IInput {
  id: string;
  inputGroupId: string;
  sqlValue: Column;
  staticValue: string;
  conceptMapId: string;
  script: string;
}

export interface Condition {
  id: string;
  inputGroupId?: string;
  action: string;
  sqlValue: Column;
  relation: string;
  value: string;
}

export interface Filter {
  sqlColumn: Column;
  relation: string;
  value: string;
}

export interface Column {
  id?: string;
  owner?: Owner;
  table: string;
  column: string;
  joins?: Join[];
}

export interface Join {
  id?: string;
  tables: Column[];
}

export interface JoinInput {
  source: Column;
  target: Column;
}

export interface ISelectedNode {
  source: ISelectedSource;
  resource: Resource;
  attribute: Attribute;
}

export interface IComment {
  id: string;
  author: IUser;
  content: string;
  validation: boolean;
  createdAt: string;
}

export interface IRecommendedColumns {
  columnsByAttribute: {
    [fhirAttribute: string]: any;
  };
}

export interface IData {
  recommendedColumns: IRecommendedColumns;
}

export interface IFhir {
  extensions: { [path: string]: ResourceDefinition[] };
  availableResources: ResourceDefinition[];
}

export interface BatchResource {
  resource_id: string;
  resource_type?: string;
}

export interface Batch {
  id: string;
  timestamp: string;
  resources: BatchResource[];
}

export interface BatchResponse {
  data: Record<string, Batch>;
  error: string | null;
}

export interface DagConf {
  dag_id: string;
  mapping_id: string;
  source_name: string;
  resources: BatchResource[];
  schedule_interval: string;
}

export interface DagResponse {
  data: Record<string, DagConf>;
  error: string | null;
}

export interface ScriptsResponse {
  data: Script[];
  error: string | null;
}

export interface ExploredTable {
  resourceId: string;
  owner: string;
  table: string;
  fields: string[];
  rows: string[];
  loading: boolean;
  error: string | null;
}

// Store
export interface IReduxStore {
  data: IData;
  dispatch?: any;
  fhir: IFhir;
  exploredTable: ExploredTable;
  batchList: BatchResponse;
  recurringBatchList: DagResponse;
  scriptList: ScriptsResponse;
  selectedNode: ISelectedNode;
  resourceAttributes: any;
  structure: any;
  user: IUser;
  views: any;
}

// FHIR

export interface CodeSystem {
  resourceType: string;
  title: string;
  name: string;
  status: string;
  url: string;
  valueSet: string;
  concept: Concept[];
}

export interface ConceptMap {
  id?: string;
  resourceType: string;
  title: string;
  name: string;
  sourceUri: string;
  targetUri: string;
  description?: string;
  status: string;
  group: Group[];
}

export interface Script {
  name: string;
  category: string;
  description: string;
}
interface Concept {
  code: string;
}

export interface Group {
  source: string;
  target: string;
  element: Element[];
}

interface Element {
  code: string;
  target: Target[];
}

interface Target {
  code: string;
  equivalence: string;
}

export interface Terminology {
  title: string;
  valueSetUrl: string;
  codes: Code[];
  type: 'ValueSet' | 'CodeSystem';
}

export interface Code {
  value: string;
  system?: string;
}

// VIEWS

export interface IView {
  // Apollo client (withApollo from 'react-apollo')
  client?: any;
  data?: IData;
  dispatch?: any;
  // Router history (withRouter from 'react-router-dom')
  history?: any;
  // Router location (withRouter from 'react-router-dom')
  location?: any;
  selectedNode?: ISelectedNode;
  user?: IUser;
}

// REACT

// TODO: Deprecate type
export interface ISource {
  name: string;
  schema: any;
}

export interface ITemplate {
  name: string;
  sources: ISource[];
}

export interface ISourceSchema {
  [table: string]: string[];
}
