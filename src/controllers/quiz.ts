import { getRepository } from 'fireorm'
import { packQuiz, packQuizzes } from '../mappers/quizMapper'
import { Quiz } from '../models'
import * as Schema from '../resolvers/resolvers-types'
import { NotFoundError } from '../utils/errors'

const QuizRepository = getRepository(Quiz)

const getQuiz = async (id: string): Promise<Schema.Quiz> => {
    const quiz = await QuizRepository.findById(id)
    return packQuiz(quiz)
}

const getAllQuizzes = async (): Promise<Schema.Quiz[]> => {
    const quizzes = await QuizRepository.find()
    return packQuizzes(quizzes)
}

const addQuiz = async (
    name: string,
    description: string,
    duration: number,
    numOfQuestions: number,
    startTime: Date,
    endTime: Date,
): Promise<Schema.Quiz> => {
    const quiz = new Quiz()

    quiz.name = name
    quiz.description = description
    quiz.duration = duration
    quiz.numOfQuestions = numOfQuestions
    quiz.startTime = startTime
    quiz.endTime = endTime

    const newQuiz = await QuizRepository.create(quiz)

    return await getQuiz(newQuiz.id)
}

const editQuiz = async (
    id: string,
    name?: string,
    description?: string,
    duration?: number,
    numOfQuestions?: number,
    startTime?: Date,
    endTime?: Date,
    questionIDsOrder?: string[],
): Promise<Schema.Quiz> => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(id)
        if (!quiz) {
            throw new NotFoundError()
        }

        quiz.name = name ? name : quiz.name
        quiz.description = description ? description : quiz.description
        quiz.duration = duration ? duration : quiz.duration
        quiz.numOfQuestions = numOfQuestions
            ? numOfQuestions
            : quiz.numOfQuestions
        quiz.startTime = startTime ? startTime : quiz.startTime
        quiz.endTime = endTime ? endTime : quiz.endTime
        quiz.questionIDsOrder = questionIDsOrder
            ? questionIDsOrder
            : quiz.questionIDsOrder
        quiz.modified = new Date()

        tran.update(quiz)

        return packQuiz(quiz)
    })
}

const deleteQuiz = async (id: string): Promise<void> => {
    return QuizRepository.runTransaction(async (tran) => {
        return tran.delete(id)
    })
}

export { getAllQuizzes, getQuiz, addQuiz, editQuiz, deleteQuiz }
