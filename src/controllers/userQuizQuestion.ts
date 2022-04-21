import { Option, Question, Quiz, UserQuiz, UserQuizQuestion } from '../models'
import { getUserQuiz, setUserQuizScore } from './userQuiz'
import { firestore as db, firestore } from '../utils/firebase'
import { getRepository, runTransaction } from 'fireorm'
import * as Schema from '../resolvers/resolvers-types'
import { NotFoundError } from '../utils/errors'
import {
    PackQuizQuestion,
    packUserQuizQuestion,
    packUserQuizQuestions,
} from '../mappers/userQuizQuestionMapper'
import { packOption, packOptions } from '../mappers/optionMapper'

const getUserQuizQuestion = async (
    userQuizID: string,
    id: string,
): Promise<Schema.UserQuizQuestion> => {
    return runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)
        if (!userQuiz || !userQuiz.questions) {
            throw new NotFoundError()
        }

        const quiz = await QuizTranRepository.findById(userQuiz.id)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const quizQuestion = await quiz.questions.findById(id)
        const userQuizQuestion = await userQuiz.questions.findById(id)

        if (userQuizQuestion == null || quizQuestion == null) {
            throw new NotFoundError()
        }

        return packUserQuizQuestion({
            quizQuestion,
            userQuizQuestion,
        })
    })
}

const getUserQuizQuestions = async (
    userQuizID: string,
): Promise<Schema.UserQuizQuestion[]> => {
    return runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)

        const quiz = await QuizTranRepository.findById(userQuiz.id)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const quizQuestions = await quiz.questions.find()

        const userQuizQuestions: PackQuizQuestion[] = await Promise.all(
            quizQuestions.map(async (quizQuestion) => {
                if (!userQuiz || !userQuiz.questions) {
                    throw new NotFoundError()
                }
                const userQuizQuestion = await userQuiz.questions.findById(
                    quizQuestion.id,
                )
                if (!userQuizQuestion) {
                    throw new NotFoundError()
                }

                return {
                    quizQuestion,
                    userQuizQuestion,
                }
            }),
        )

        return packUserQuizQuestions(userQuizQuestions)
    })
}

const addUserQuizQuestion = async (
    userQuizID: string,
    questionID: string,
): Promise<Schema.UserQuizQuestion> => {
    return runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)
        if (!userQuiz || !userQuiz.questions) {
            throw new NotFoundError()
        }

        const quiz = await QuizTranRepository.findById(userQuiz.quiz.id)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(questionID)
        if (!question) {
            throw new NotFoundError()
        }

        const userQuizQuestion = new UserQuizQuestion()
        userQuizQuestion.id = question.id
        userQuizQuestion.question = firestore
            .collection('Quizzes')
            .doc(quiz.id)
            .collection('Questions')
            .doc(question.id)
        userQuizQuestion.answer = null
        userQuizQuestion.firstViewed = null
        userQuizQuestion.lastAnswered = null

        const newUserQuizQuestion = await userQuiz.questions.create(
            userQuizQuestion,
        )

        return await getUserQuizQuestion(userQuizID, newUserQuizQuestion.id)
    })
}

const editUserQuizQuestion = async (
    userQuizID: string,
    questionID: string,
    optionID: string | undefined,
    flag: boolean | undefined,
) => {
    return runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)
        if (!userQuiz || !userQuiz.questions) {
            throw new NotFoundError()
        }

        const quiz = await QuizTranRepository.findById(userQuiz.quiz.id)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(questionID)
        if (!question) {
            throw new NotFoundError()
        }

        let userQuizQuestion = await userQuiz.questions.findById(questionID)
        if (!userQuizQuestion) {
            userQuizQuestion = new UserQuizQuestion()
        }

        userQuizQuestion.id = question.id
        userQuizQuestion.question = firestore
            .collection('Quizzes')
            .doc(quiz.id)
            .collection('Questions')
            .doc(question.id)
        userQuizQuestion.answer = optionID
            ? firestore
                  .collection('Quizzes')
                  .doc(quiz.id)
                  .collection('Questions')
                  .doc(question.id)
                  .collection('Options')
                  .doc(optionID)
            : userQuizQuestion.answer
        userQuizQuestion.firstViewed = new Date()
        userQuizQuestion.lastAnswered = new Date()
        userQuizQuestion.modified = new Date()
        userQuizQuestion.flag = flag ?? userQuizQuestion.flag

        const newUserQuizQuestion = await userQuiz.questions.create(
            userQuizQuestion,
        )

        return await getUserQuizQuestion(userQuizID, newUserQuizQuestion.id)
    })
}

const getUserQuizQuestionOptions = async (
    userQuizID: string,
    questionID: string,
): Promise<Schema.Option[]> => {
    return runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)
        if (!userQuiz || !userQuiz.questions) {
            throw new NotFoundError()
        }

        const quiz = await QuizTranRepository.findById(userQuiz.id)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const quizQuestion = await quiz.questions.findById(questionID)
        if (!quizQuestion || !quizQuestion.options) {
            throw new NotFoundError()
        }

        const options = await quizQuestion.options.find()

        let count = options.length,
            randomnumber,
            temp
        while (count) {
            randomnumber = (Math.random() * count--) | 0
            temp = options[count]
            options[count] = options[randomnumber]
            options[randomnumber] = temp
        }

        return packOptions(options)
    })
}

const getUserAnswerIDs = async (userQuizID: string): Promise<string[]> => {
    const userQuizQuestions = await getUserQuizQuestions(userQuizID)

    const userAnswerIDs = (
        await Promise.all(
            userQuizQuestions.map(async (userQuizQuestion) => {
                const answer = await userQuizQuestion.userAnswer
                if (!answer) {
                    // Each question should have an answer
                    throw new NotFoundError()
                }
                return answer.id
            }),
        )
    ).filter((question) => question !== null)

    return userAnswerIDs
}

const submitUserQuizQuestions = async (
    userQuizID: string,
    userAnswers: string[],
    correctAnswers: string[],
) => {
    // calculate score starting at index 0
    const calculatedScore = userAnswers.reduce((score, userAnswer, index) => {
        return userAnswer === correctAnswers[index] ? score + 1 : score
    }, 0)

    // update userQuiz
    await setUserQuizScore(userQuizID, calculatedScore)

    return getUserQuiz(userQuizID)
}

export {
    getUserQuizQuestion,
    getUserQuizQuestions,
    addUserQuizQuestion,
    editUserQuizQuestion,
    getUserQuizQuestionOptions,
    submitUserQuizQuestions,
    getUserAnswerIDs,
}
