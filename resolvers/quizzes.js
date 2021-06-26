import {
    getUserQuiz,
    getAllQuizzes,
    getAllUserQuizzes,
    getQuestions,
    addQuiz,
    editQuiz,
} from '../controllers'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

const resolvers = {
    Quiz: {
        questions: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()
            return await getQuestions(parents)
        },
    },
    Query: {
        quizzes: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()
            return await getAllQuizzes()
        },
    },
    Mutation: {
        addQuiz: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()

            const {
                name,
                description,
                duration,
                numOfQuestions,
                startTime,
                endTime,
            } = input

            return await addQuiz(
                name,
                description,
                duration,
                numOfQuestions,
                startTime,
                endTime,
            )
        },
        editQuiz: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()

            const {
                id,
                name,
                description,
                duration,
                numOfQuestions,
                startTime,
                endTime,
            } = input

            return await editQuiz(
                id,
                name,
                description,
                duration,
                numOfQuestions,
                startTime,
                endTime,
            )
        },
    },
}

export default resolvers
