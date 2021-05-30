import { getUser, getAllUsers } from '../controllers/user'

const studUser = {
    id: '123',
    displayName: 'user',
    email: 'user@email.com',
    emailVerified: 'user@email.com',
    photoURL: 'https://i.imgur.com/G4cy8en.jpg',
    firstName: 'Joe',
    lastName: 'Smith',
    yearLevel: 9,
    role: 'student',
    created: Date.now(),
    modified: Date.now(),
}

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
