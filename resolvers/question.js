import { getQuestionOptions } from '../controllers'

const resolvers = {
    Question: {
        options: async (parents, args, ctx) => {
            return await getQuestionOptions(parents.id)
        },
    },
    Query: {},
    Mutation: {
        addQuestion: async (parent, { input }, context) => {},
        editQuestion: async (parent, { input }, context) => {},
    },
}

export default resolvers
