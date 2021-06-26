import {
    getUserQuiz,
    getUserQuizQuestions,
    getUserQuizQuestion,
    getUserQuizQuestionOptions,
    getUser,
    getUserQuizQuestionOptionID,
    editUserQuizQuestion,
    getQuiz,
} from '../controllers'
import {
    addUserQuiz,
    getAllUserQuizzes,
    getUserQuizzes,
} from '../controllers/userQuiz'

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
            if (!parents.answer) return null

            return await parents.answer.get()
        },
        options: async (parents, args, context) => {
            return await getUserQuizQuestionOptions(parents)
        },
    },
    Query: {
        userQuizzes: async (parents, args, context) => {
            return await getUserQuizzes(args.userID)
        },
        userQuiz: async (parents, args, context) => {
            return await getUserQuiz(args.userID)
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
