import { getUserQuiz, getAllUserQuizzes } from '../controllers'

const resolvers = {
    Query: {
        userQuizzes: async (parents, args, ctx) => {
            return await getAllUserQuizzes(args.userID)
        },
        userQuiz: async (parents, args, ctx) => {
            return await getUserQuiz(args.userID)
        },
    },
    Mutation: {
        addUser: async (parent, { input }, context) => {},
        editUser: async (parent, { input }, context) => {},
    },
}

export default resolvers
