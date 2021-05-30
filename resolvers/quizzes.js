import { getUserQuiz, getAllQuizzes, getAllUserQuizzes} from '../controllers/quiz'

const resolvers = {
    Query: {
        quizzes: async (parents, args, ctx) => {
            return await getAllQuizzes()
        },
        userQuizzes: async (parents, args, ctx) => {
            return await getAllUserQuizzes() 
        },
        userQuiz: async (parents, args, ctx) => {
            return await getUserQuiz(args.quizID)
        },
    },
}

export default resolvers
