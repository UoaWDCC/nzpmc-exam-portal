import {
    getUserQuiz,
    getUserQuizQuestions,
    getUserQuizQuestion,
    getUserQuizQuestionOptionsByQuestion,
    getUser,
    getUserQuizQuestionOptionID,
    editUserQuizQuestion,
    getQuiz,
} from '../controllers'
import { addUserQuiz, getUserQuizzes } from '../controllers/userQuiz'

const resolvers = {
    UserQuiz: {
        user: async (parents, args, context) => {
            if (!parents.userObj) return null
            return await parents.userObj.get()
        },
        question: async (parents, args, context) => {
            return await getUserQuizQuestion(parents, args.id)
        },
        questions: async (parents, args, context) => {
            return await getUserQuizQuestions(parents)
        },
    },
    UserQuizQuestion: {
        userAnswer: async (parents, args, context) => {
            if (!parents.userAnswerObj) return null

            return await parents.userAnswerObj.get()
        },
        options: async (parents, args, context) => {
            if (!parents.questionObj) return null

            return await getUserQuizQuestionOptionsByQuestion(
                parents.questionObj,
            )
        },
    },
    Query: {
        userQuizzes: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()

            return await getUserQuizzes(context.user.uid)
        },
        userQuiz: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()

            const userQuiz = await getUserQuiz(args.quizID)
            const user = await userQuiz.userObj.get()

            if (user.id !== context.user.uid) throw new AuthenticationError()
            return userQuiz
        },
    },
    Mutation: {
        addUserQuiz: async (parents, { input }, context) => {
            const { userID, quizID, startTime, endTime } = input

            const user = await getUser(userID)
            const quiz = await getQuiz(quizID)

            return await addUserQuiz(
                user,
                quiz,
                new Date(startTime),
                new Date(endTime),
            )
        },
        editUserQuizQuestion: async (parents, { input }, context) => {
            const userQuiz = getUserQuiz(input.userQuizID)
            const answer = getUserQuizQuestionOptionID(userQuiz, input.answer)

            return await editUserQuizQuestion(userQuiz, id, answer)
        },
    },
}

export default resolvers
