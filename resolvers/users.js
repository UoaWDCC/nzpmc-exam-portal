import { getUser, getAllUsers, addUser, editUser } from '../controllers'
import { AuthenticationError } from 'apollo-server-express'
import { AdminAuthenticationError } from '../utils/errors'

const resolvers = {
    Query: {
        user: async (parents, args, ctx) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            return await getUser(args.userID)
        },
        me: async (parents, args, ctx) => {
            if (!context.user) throw new AuthenticationError()

            if (!ctx.user) return
            return await getUser(ctx.user.uid)
        },
        users: async (parents, args, ctx) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            return await getAllUsers()
        },
    },
    Mutation: {
        addUser: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const {
                id,
                displayName,
                email,
                photoURL,
                firstName,
                lastName,
                yearLevel,
                role,
            } = input

            return await addUser(
                id,
                displayName,
                email,
                photoURL,
                firstName,
                lastName,
                yearLevel,
                role,
            )
        },
        editUser: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const {
                id,
                displayName,
                email,
                photoURL,
                firstName,
                lastName,
                yearLevel,
            } = input

            return await editUser(
                id,
                displayName,
                email,
                photoURL,
                firstName,
                lastName,
                yearLevel,
            )
        },
        editSelf: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()

            const {
                displayName,
                email,
                photoURL,
                firstName,
                lastName,
                yearLevel,
            } = input

            return await editUser(
                uid,
                displayName,
                email,
                photoURL,
                firstName,
                lastName,
                yearLevel,
            )
        },
    },
}

export default resolvers
