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
    editUserQuiz,
    submitUserQuizQuestions,
} from '../controllers'
import { AuthenticationError } from 'apollo-server-express'
import { AdminAuthenticationError } from '../utils/errors'

const resolvers = {
    UserQuiz: {
        user: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()

            if (!parents.userObj || !parents.userObj.ref) return null
            return await parents.userObj.get()
        },
        question: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()

            return await getUserQuizQuestion(parents, args.id)
        },
        questions: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()

            return await getUserQuizQuestions(parents)
        },
    },
    UserQuizQuestion: {
        userAnswer: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()

            if (
                !parents.userQuizQuestionObj ||
                !parents.userQuizQuestionObj.answer ||
                !parents.userQuizQuestionObj.answer.ref
            ) {
                return null
            }

            return parents.userQuizQuestionObj.answer.get()
        },
        options: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()

            if (!parents.questionObj) return null

            return await getUserQuizQuestionOptionsByQuestion(
                parents.questionObj,
            )
        },
    },
    Query: {
        userQuizzes: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()

            const userQuizzes = await getUserQuizzes(context.user.uid)

            return userQuizzes
        },
        userQuiz: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()

            const userQuiz = await getUserQuiz(args.quizID)
            const user = await userQuiz.userObj.get()

            if (user.id !== context.user.uid && !context.user.admin)
                throw new AuthenticationError()

            if (!context.user.admin) {
                // If the quiz isn't started yet, throw error
                if (!userQuiz.startTime) throw new AuthenticationError()
                userQuiz.score = null
            }

            return userQuiz
        },
    },
    Mutation: {
        addUserQuiz: async (parents, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const { userID, quizID } = input

            const user = await getUser(userID)
            const quiz = await getQuiz(quizID)

            return await addUserQuiz(user, quiz)
        },
        editUserQuiz: async (parents, { input }, context) => {
            if (!context.user) throw new AuthenticationError()

            if (!context.user.admin) {
                // is not Admin
                const { userQuizID, startTime } = input

                if (startTime) {
                    startTime = new Date().valueOf()
                }

                const userQuizObj = await getUserQuiz(userQuizID)
                if (userQuizObj.startTime) {
                    // if startTime is already set need to be admin to change
                    throw new AdminAuthenticationError()
                }

                return await editUserQuiz(userQuizID, null, startTime, null)
            }

            // is Admin
            const { userQuizID, score, startTime, endTime } = input

            return await editUserQuiz(userQuizID, score, startTime, endTime)
        },
        editUserQuizQuestion: async (parents, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const { userQuizID, questionID, answerID, flag } = input

            const userQuiz = await getUserQuiz(userQuizID)

            const quiz = await userQuiz.quizObj.get()

            const question = await getQuestion(quiz, questionID)

            let answerKey = answerID
            if (answerID) {
                answerKey = (await getOptionByQuestionID(question, answerID))
                    .key
            }

            return {
                ...(await editUserQuizQuestion(
                    userQuiz,
                    questionID,
                    answerKey,
                    flag,
                )),
                imageURI: question.imageURI,
                question: question.question,
                questionObj: question,
            }
        },
        submitUserQuizQuestions: async (parents, { input }, context) => {
            const { userQuizID } = input

            const userQuiz = await getUserQuiz(userQuizID)
            const quiz = await userQuiz.quizObj.get()

            // ensure quiz cannot be submitted if currenttime is after the quiz endtime with 60s leeway
            if (Date.now() / 1000 > quiz.endTime._seconds + 60) {
                throw new AuthenticationError()
            }

            const userAnswers = await getUserAnswerIDs(userQuiz)
            const correctAnswers = await Promise.all(
                (
                    await getQuestions(quiz)
                ).map(async (question) => {
                    return (await question.answerObj.get()).id
                }),
            )

            // update UserQuiz
            return await submitUserQuizQuestions(
                userQuizID,
                userAnswers,
                correctAnswers,
            )
        },
    },
}

export default resolvers
