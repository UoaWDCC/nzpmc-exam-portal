import {
    getUserQuiz,
    getUserQuizQuestions,
    getUserQuizQuestion,
    getUserQuizQuestionOptionsByQuestion,
    getUser,
    addUserQuiz,
    getUserQuizzes,
    getOptionByQuestionID,
    editUserQuizQuestion,
    getQuiz,
    getQuestion,
    getQuestions,
    getUserAnswerIDs,
    submitUserQuizQuestions,
} from '../controllers'

import { AuthenticationError } from 'apollo-server-core'

const resolvers = {
    UserQuiz: {
        user: async (parents, args, context) => {
            if (!parents.userObj || !parents.userObj.ref) return null
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
            if (
                !parents.userAnswerObj ||
                !parents.userAnswerObj.answer ||
                !parents.userAnswerObj.answer.ref
            )
                return null

            return parents.userAnswerObj.answer.get()
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
            const { id, userQuizID, questionID, answerID } = input

            const userQuiz = await getUserQuiz(userQuizID)
            const quiz = await userQuiz.quizObj.get()

            const question = await getQuestion(quiz, questionID)
            const answer = await getOptionByQuestionID(question, answerID)

            return await editUserQuizQuestion(userQuiz, id, answer)
        },
        submitUserQuizQuestions: async (parents, { input }, context) => {
            const { userQuizID } = input

            // get necessary objects
            const userQuiz = await getUserQuiz(userQuizID)
            const quiz = await userQuiz.quizObj.get()
            const userAnswers = await getUserAnswerIDs(userQuiz)
            const correctAnswers = (await getQuestions(quiz)).map((question) => question.id)

            // update UserQuiz
            return await submitUserQuizQuestions(userQuizID, userAnswers, correctAnswers)
        },
    },
}

export default resolvers
