import { GraphQLResolveInfo } from 'graphql/type'
import { AuthenticationError } from '../../utils/errors'
import { AdminAuthenticationError } from '../../utils/errors'
import { UserContext } from '../../utils/firebase'
import { Resolver, ResolverFn } from '../resolvers-types'

const admin =
    <TResolver extends ResolverFn<any, any, UserContext, any>>(
        resolver: TResolver,
    ): Resolver<any, any, UserContext, any> =>
    (parent, args, context: UserContext, info: GraphQLResolveInfo): void => {
        if (!context.user) throw new AuthenticationError()
        if (!context.user.admin) throw new AdminAuthenticationError()
        resolver(parent, args, context, info)
    }

const user =
    <TResolver extends ResolverFn<any, any, UserContext, any>>(
        resolver: TResolver,
    ): Resolver<any, any, UserContext, any> =>
    async (parent, args, context: UserContext, info: GraphQLResolveInfo) => {
        if (!context.user) throw new AuthenticationError()
        resolver(parent, args, context, info)
    }

export { admin, user }
