import { getQuestion, getAllQuestions } from '../controllers/question'

const resolvers = {
    Query: {
        question: async (parents, args, ctx) => {
            return await getQuestion(args.questionID) 
        },
        questions: async (parents, args, ctx) => {
            return await getAllQuestions() 
        },
    },
}

export default resolvers
