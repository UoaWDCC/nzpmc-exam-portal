import { getUser, getAllUsers } from '../controllers'

const resolvers = {
    Query: {
        user: async (parents, args, ctx) => {
            return await getUser(args.userID)
        },
        me: async (parents, args, ctx) => {
            if (!ctx.user) return
            return await getUser(ctx.user.uid)
        },
        users: async (parents, args, ctx) => {
            return await getAllUsers()
        },
    },
    Mutation: {
        addUser: async (parent, { input }, context) => {},
        editUser: async (parent, { input }, context) => {},
    },
}

export default resolvers
