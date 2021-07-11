import {
    addQuestion,
    editQuestion,
    getQuestionOptions,
    getQuiz,
} from '../controllers'
import { AuthenticationError } from 'apollo-server-express'
import { AdminAuthenticationError } from '../utils/errors'

const resolvers = {
    Question: {
        options: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            return await getQuestionOptions(parents)
        },
        answer: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            if (!parents.answerObj || !parents.answerObj.ref) return null
            return await parents.answerObj.get()
        },
    },
    Query: {},
    Mutation: {
        addQuestion: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const { quizID, question, imageURI, numOfAnswers, topics } = input

            const quiz = await getQuiz(quizID)

            return await addQuestion(
                quiz,
                question,
                imageURI,
                numOfAnswers,
                topics,
            )
        },
        editQuestion: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const {
                quizID,
                id,
                question,
                imageURI,
                numOfAnswers,
                topics,
            } = input

            const quiz = await getQuiz(quizID)

            return await editQuestion(
                quiz,
                id,
                question,
                imageURI,
                numOfAnswers,
                topics,
            )
        },
    },
}

export default resolvers
