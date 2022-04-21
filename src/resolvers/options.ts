import { addQuestionOption, editQuestionOption } from '../controllers'
import { AuthenticationError } from '../utils/errors'
import { AdminAuthenticationError } from '../utils/errors'

const resolvers = {
    Query: {},
    Mutation: {
        addOption: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const { quizID, questionID, option } = input

            return await addQuestionOption(quizID, questionID, option)
        },
        editOption: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const { quizID, questionID, option, id } = input

            return await editQuestionOption(quizID, questionID, id, option)
        },
        editAnswer: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const { quizID, questionID, option } = input

            return await editQuestionOption(
                quizID,
                questionID,
                question,
                option,
            )
        },
    },
}

export default resolvers
