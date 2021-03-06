import { rule, shield } from 'graphql-shield'

import { Context } from 'context'
import { getSourceIdFromMutationArgs } from './resolvers'
import { User } from '@prisma/client'
import { ENV } from '../constants'

export const authenticationError = {
  code: 'AUTHENTICATION_ERROR',
  statusCode: 401,
  message: 'User not found, maybe token is invalid.',
}
export const authorizationError = {
  code: 'AUTHORIZATION_ERROR',
  statusCode: 403,
}

// We want to skip authorization checks during integration tests
const skipAuthorizations = ENV === 'test'

const checkUser = (user: User | undefined): Error | undefined => {
  if (!user) {
    return new Error(
      `${authenticationError.code}: ${authenticationError.message}`,
    )
  }
  if (!user.email) {
    return new Error('User does not have an email.')
  }
}
const rules = {
  isAuthenticatedUser: rule()((_, __, ctx: Context) => {
    const err = checkUser(ctx.user)
    if (err) return err
    return true
  }),
  isAdmin: rule()(async (_, __, ctx: Context) => {
    const { user } = ctx
    const err = checkUser(user)
    if (err) return err

    if (user!.role !== 'ADMIN') {
      return new Error(
        `${authorizationError.code}: You need to be admin to perform this action`,
      )
    }
    return true
  }),
  isSourceReader: rule()(async (_, args, ctx: Context) => {
    const { user } = ctx
    const err = checkUser(user)
    if (err) return err

    // Return true if the user is admin
    if (user!.role === 'ADMIN') return true

    let sourceId = await getSourceIdFromMutationArgs(args, ctx)

    // Check access
    const access = await ctx.prisma.accessControl.findMany({
      where: {
        user: { id: user!.id },
        source: { id: sourceId },
      },
    })

    if (access.length === 0) {
      return new Error(
        `${authorizationError.code}: You don't have read access on this source`,
      )
    }
    return true
  }),
  isSourceWriter: rule()(async (_, args, ctx: Context) => {
    const { user } = ctx
    const err = checkUser(user)
    if (err) return err

    // Return true if the user is admin
    if (user!.role == 'ADMIN') return true

    let sourceId = await getSourceIdFromMutationArgs(args, ctx)

    // Check role
    const access = await ctx.prisma.accessControl.findMany({
      where: {
        user: { id: user!.id },
        source: { id: sourceId },
        role: 'WRITER',
      },
    })

    if (access.length === 0) {
      return new Error(
        `${authorizationError.code}: You don't have write access on this source`,
      )
    }
    return true
  }),
}

export const permissions = shield(
  skipAuthorizations
    ? {}
    : {
        Query: {
          me: rules.isAuthenticatedUser,
          credential: rules.isAuthenticatedUser,
          sources: rules.isAuthenticatedUser,
          source: rules.isAuthenticatedUser,
          resource: rules.isAuthenticatedUser,
          attribute: rules.isAuthenticatedUser,
          structureDefinition: rules.isAuthenticatedUser,
        },
        Mutation: {
          logout: rules.isAuthenticatedUser,
          updateRole: rules.isAdmin,

          createTemplate: rules.isAuthenticatedUser,
          deleteTemplate: rules.isAdmin,

          createAccessControl: rules.isSourceWriter,
          deleteAccessControl: rules.isSourceWriter,

          createSource: rules.isAuthenticatedUser,
          deleteSource: rules.isSourceWriter,

          upsertCredential: rules.isSourceWriter,
          deleteCredential: rules.isSourceWriter,

          createResource: rules.isSourceWriter,
          updateResource: rules.isSourceWriter,
          deleteResource: rules.isSourceWriter,

          createAttribute: rules.isSourceWriter,
          deleteAttribute: rules.isSourceWriter,

          createComment: rules.isSourceReader,

          createInputGroup: rules.isSourceWriter,
          updateInputGroup: rules.isSourceWriter,
          addConditionToInputGroup: rules.isSourceWriter,

          updateCondition: rules.isSourceWriter,
          deleteCondition: rules.isSourceWriter,

          createSqlInput: rules.isSourceWriter,
          createStaticInput: rules.isSourceWriter,
          updateInput: rules.isSourceWriter,
          deleteInput: rules.isSourceWriter,

          addJoinToColumn: rules.isSourceWriter,
          updateJoin: rules.isSourceWriter,
          deleteJoin: rules.isSourceWriter,
        },
      },
  { allowExternalErrors: true },
)
