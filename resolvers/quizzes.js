import {
    getUserQuiz,
    getAllQuizzes,
    getAllUserQuizzes,
    getQuizQuestions,
} from '../controllers'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

const resolvers = {
    Quiz: {
        questions: async (parents, args, ctx) => {
            if (!context.user) throw new AuthenticationError()
            return await getQuizQuestions(parents.id)
        },
    },
    Query: {
        quizzes: async (parents, args, ctx) => {
            if (!context.user) throw new AuthenticationError()
            return await getAllQuizzes()
        },
    },
    Mutation: {
        addQuiz: async (parent, { input }, context) => {},
        editQuiz: async (parent, { input }, context) => {},
    },
}

export default resolvers
