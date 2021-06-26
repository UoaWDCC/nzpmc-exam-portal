import {
    getUserQuiz,
    getUserQuizQuestions,
    getUserQuizQuestion,
    getUserQuizQuestionOptions,
} from '../controllers'

const resolvers = {
    UserQuiz: {
        question: async (parents, args, ctx) => {
            return await getUserQuizQuestion(parents, args.id)
        },
        questions: async (parents, args, ctx) => {
            return await getUserQuizQuestions(parents)
        },
    },
    UserQuizQuestion: {
        userAnswer: async (parents, args, ctx) => {
            return await parents.answer.get()
        },
        options: async (parents, args, ctx) => {
            return await getUserQuizQuestionOptions(parents)
        },
    },
    Query: {
        userQuizzes: async (parents, args, ctx) => {
            return await parents.question.get()
        },
        userQuiz: async (parents, args, ctx) => {
            return await getUserQuiz(args.userID)
        },
    },
    Mutation: {
        addUserQuiz: async (parents, args, ctx) => {
            await addUserQuiz
        },
    },
}

export default resolvers
