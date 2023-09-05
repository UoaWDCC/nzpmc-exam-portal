import { getRepository } from 'fireorm'
import { packQuiz, packQuizzes } from '../mappers/quizMapper'
import { Quiz } from '../models'
import * as Schema from '@nzpmc-exam-portal/common'
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
    name?: string | null,
    description?: string | null,
    duration?: number | null,
    openTime?: Date | null,
    closeTime?: Date | null,
): Promise<Schema.Quiz> => {
    const quiz = new Quiz()

    quiz.name = name ?? ``
    quiz.description = description ?? ``
    quiz.duration = duration ?? 69
    quiz.openTime = openTime ?? new Date()
    quiz.closeTime = closeTime ?? new Date()

    const newQuiz = await QuizRepository.create(quiz)

    return await getQuiz(newQuiz.id)
}

const editQuiz = async (
    id: string,
    name?: string,
    description?: string,
    duration?: number,
    openTime?: Date,
    closeTime?: Date,
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
        quiz.openTime = openTime ? openTime : quiz.openTime
        quiz.closeTime = closeTime ? closeTime : quiz.closeTime
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
