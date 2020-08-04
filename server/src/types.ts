import {
  Attribute,
  Column,
  Comment,
  Condition,
  Filter,
  Input,
  InputGroup,
  Join,
  Resource,
  User,
} from '@prisma/client'

export type JoinWithColumn = Join & {
  tables: Column[]
}

export type ColumnWithJoins = Column & {
  joins: JoinWithColumn[]
}

export type InputWithColumn = Input & {
  sqlValue: ColumnWithJoins
}

export type InputGroupWithInputs = InputGroup & {
  inputs: InputWithColumn[]
  conditions: ConditionWithColumn[]
}

export type ConditionWithColumn = Condition & {
  column: Column
}

export type AttributeWithInputGroups = Attribute & {
  comments: CommentWithAuthor[]
  inputGroups: InputGroupWithInputs[]
}

export type AttributeWithInputs = Attribute & {
  inputs: InputWithColumn[]
}

export type ResourceWithAttributes = Resource & {
  attributes: AttributeWithInputGroups[]
}

export type AttributeWithCommentsPreV7 = AttributeWithInputs & {
  comments: string
  mergingScript: string
}

export type CommentWithAuthor = Comment & {
  author: User
}

export type AttributeWithComments = AttributeWithInputs & {
  comments: CommentWithAuthor[]
  mergingScript: string
}

export type FilterWithSqlColumn = Filter & {
  sqlColumn: Column
}
