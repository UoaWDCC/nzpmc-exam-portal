import {
    getUserQuiz,
    getAllQuizzes,
    getAllUserQuizzes,
    getQuizQuestions,
    addQuiz,
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
        addQuiz: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()

            const { name, descirption, duration, startTime, endTime } = input
            return await addQuiz(
                name,
                descirption,
                duration,
                startTime,
                endTime,
            )
        },
        editQuiz: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()

            const { name, descirption, duration, startTime, endTime } = input
            return await addQuiz(
                name,
                descirption,
                duration,
                startTime,
                endTime,
            )
        },
    },
}

export default resolvers
