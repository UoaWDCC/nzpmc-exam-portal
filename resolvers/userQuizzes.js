import {
    getUserQuiz,
    getUserQuizQuestions,
    getUserQuizQuestion,
    getUserQuizQuestionOptions,
    getUser,
    getUserQuizQuestionOptionID,
    editUserQuizQuestion,
} from '../controllers'
import { addUserQuiz } from '../controllers/userQuiz'

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
            if (!parents.answer) return null

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
            const user = getUser(args.userID)
            const quiz = getQuiz(args.quizID)

            return await addUserQuiz(user, quiz, args.startTime, args.endTime)
        },
        editUserQuizQuestion: async (parents, args, ctx) => {
            const userQuiz = getUserQuiz(args.userQuizID)
            const answer = getUserQuizQuestionOptionID(userQuiz, args.answer)

            return await editUserQuizQuestion(userQuiz, id, answer)
        },
    },
}

export default resolvers
