import { Option, Question, Quiz, UserQuiz, UserQuizQuestion } from '../models'
import { getUserQuiz, setUserQuizScore } from './userQuiz'
import { firestore as db, firestore } from '../utils/firebase'
import { getRepository, runTransaction } from 'fireorm'
import * as Schema from '../resolvers/resolvers-types'
import { NotFoundError } from '../utils/errors'
import {
    packUserQuizQuestion,
    packUserQuizQuestions,
} from '../mappers/userQuizQuestionMapper'

const UserQuizRepository = getRepository(UserQuiz)

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

        const userQuizQuestions: Schema.UserQuizQuestion[] = await Promise.all(
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

                return packUserQuizQuestion({
                    quizQuestion,
                    userQuizQuestion,
                })
            }),
        )

        return userQuizQuestions
    })
}

const addUserQuizQuestion = async (userQuizID: string, questionID: string) => {
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

const getUserQuizQuestionOptions = async (quizQuestion) => {
    return runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

    const question = await userQuizQuestion.question.get()

    return await getUserQuizQuestionOptionsByQuestion(question)
}

const getUserQuizQuestionOptionsByQuestion = async (question) => {
    const options = (await Option.collection.parent(question.key).fetch()).list

    let answers
    if (!question.answer || !question.answer.ref) {
        answers = options
    } else {
        const answer = await question.answer.get()
        answers = [answer, ...options]
    }

    let count = answers.length,
        randomnumber,
        temp
    while (count) {
        randomnumber = (Math.random() * count--) | 0
        temp = answers[count]
        answers[count] = answers[randomnumber]
        answers[randomnumber] = temp
    }

    return packOptions(answers)
}

const getUserAnswerIDs = async (userQuiz) => {
    const userQuizQuestions = await getUserQuizQuestions(userQuiz)

    const userAnswerIDs = await Promise.all(
        userQuizQuestions.map(async (userQuizQuestion) => {
            const answer =
                await userQuizQuestion.userQuizQuestionObj.answer.get()
            return answer.id
        }),
    )

    return userAnswerIDs
}

const submitUserQuizQuestions = async (
    userQuizID,
    userAnswers,
    correctAnswers,
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
    getUserQuizQuestionOptionsByQuestion,
    submitUserQuizQuestions,
    getUserAnswerIDs,
}
