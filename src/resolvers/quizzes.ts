import {
    getUserQuiz,
    getAllQuizzes,
    getAllUserQuizzes,
    getQuiz,
    getQuestion,
    getQuestions,
    addQuiz,
    editQuiz,
} from '../controllers'
import { AuthenticationError } from '../utils/errors'
import { AdminAuthenticationError } from '../utils/errors'

const resolvers = {
    Quiz: {
        question: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            return await getQuestion(parents, args.id)
        },
        questions: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            return await getQuestions(parents)
        },
    },
    Query: {
        quizzes: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            return await getAllQuizzes()
        },
        quiz: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            return await getQuiz(args.quizID)
        },
    },
    Mutation: {
        addQuiz: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

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
            if (!context.user.admin) throw new AdminAuthenticationError()

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
