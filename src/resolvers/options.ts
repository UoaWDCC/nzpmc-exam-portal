import {
    getQuestion,
    getQuiz,
    addQuestionOption,
    editQuestionOption,
    insertQuestionAnswer,
} from '../controllers'
import { AuthenticationError } from '../utils/errors'
import { AdminAuthenticationError } from '../utils/errors'

const resolvers = {
    Query: {},
    Mutation: {
        addOption: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const { quizID, questionID, option } = input

            const quiz = await getQuiz(quizID)

            const question = await getQuestion(quiz, questionID)

            return await addQuestionOption(question, option)
        },
        editOption: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const { quizID, questionID, option, id } = input

            const quiz = await getQuiz(quizID)

            const question = await getQuestion(quiz, questionID)

            return await editQuestionOption(question, id, option)
        },
        editAnswer: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const { quizID, questionID, option } = input

            const quiz = await getQuiz(quizID)

            const question = await getQuestion(quiz, questionID)

            return await insertQuestionAnswer(question, option)
        },
    },
}

export default resolvers
