import { getUser, getAllUsers } from '../controllers/user'

const resolvers = {
    Query: {
        user: async (parents, args, ctx) => {
            return await getUser(args.userID); 
        },
        me: async (parents, args, ctx) => {
            if (!ctx.user) return
            return await getUser(ctx.user.uid)
        },
        users: async (parents, args, ctx) => {
            return await getAllUsers()
        },
    },
}

export default resolvers
