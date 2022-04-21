import { getRepository, runTransaction } from 'fireorm'
import {
    PackUserQuiz,
    packUserQuiz,
    packUserQuizzes,
} from '../mappers/userQuizMapper'
import { Quiz, UserQuiz } from '../models'
import { getUser } from './user'
import * as Schema from '../resolvers/resolvers-types'
import { firestore } from '../utils/firebase'
import { NotFoundError } from '../utils/errors'

const QuizRepository = getRepository(Quiz)
const UserQuizRepository = getRepository(UserQuiz)

const getUserQuiz = async (id: string): Promise<Schema.UserQuiz> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const UserQuizTranRepository = tran.getRepository(UserQuiz)

        const userQuiz = await UserQuizTranRepository.findById(id)
        const quiz = await QuizTranRepository.findById(userQuiz.quiz.id)

        return packUserQuiz({ quiz, userQuiz })
    })
}

const getUserQuizzes = async (id: string): Promise<Schema.UserQuiz[]> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const UserQuizTranRepository = tran.getRepository(UserQuiz)

        const userRefDoc = await firestore.collection('Users').doc(id)
        const quizzes = await UserQuizTranRepository.whereEqualTo(
            (q) => q.user,
            userRefDoc,
        ).find()

        const userQuizzesPack: PackUserQuiz[] = await Promise.all(
            quizzes.map(
                async (userQuiz): Promise<PackUserQuiz> => ({
                    quiz: await QuizTranRepository.findById(userQuiz.quiz.id),
                    userQuiz,
                }),
            ),
        )

        return packUserQuizzes(userQuizzesPack)
    })
}

const getAllUserQuizzes = async (): Promise<Schema.UserQuiz[]> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const UserQuizTranRepository = tran.getRepository(UserQuiz)

        const quizzes = await UserQuizTranRepository.find()

        const userQuizzesPack: PackUserQuiz[] = await Promise.all(
            quizzes.map(
                async (userQuiz): Promise<PackUserQuiz> => ({
                    quiz: await QuizTranRepository.findById(userQuiz.quiz.id),
                    userQuiz,
                }),
            ),
        )

        return packUserQuizzes(userQuizzesPack)
    })
}

const addUserQuiz = async (
    userID: string,
    quizID: string,
    startTime: Date,
    endTime: Date,
): Promise<Schema.UserQuiz> => {
    const userQuiz = new UserQuiz()

    userQuiz.user = firestore.collection('Users').doc(userID)
    userQuiz.quiz = firestore.collection('Quizzes').doc(quizID)
    if (startTime && endTime) {
        userQuiz.startTime = startTime
        userQuiz.endTime = endTime
    }
    userQuiz.created = new Date()
    userQuiz.modified = new Date()

    UserQuizRepository.create(userQuiz)

    return await getUserQuiz(userQuiz.id)
}

const editUserQuiz = async (
    userQuizID: string,
    score: number | undefined,
    startTime: Date | undefined,
    endTime: Date | undefined,
): Promise<Schema.UserQuiz> => {
    return UserQuizRepository.runTransaction(async (tran) => {
        const userQuiz = await tran.findById(userQuizID)
        if (!userQuiz) {
            throw new NotFoundError()
        }

        userQuiz.score = score ? score : userQuiz.score
        userQuiz.startTime = startTime ? startTime : userQuiz.startTime
        userQuiz.endTime = endTime ? endTime : userQuiz.endTime
        userQuiz.modified = new Date()

        tran.update(userQuiz)

        return await getUserQuiz(userQuizID)
    })
}

const setUserQuizScore = (
    userQuizID: string,
    score: number,
): Promise<Schema.UserQuiz> => {
    return editUserQuiz(userQuizID, score, undefined, undefined)
}

export {
    addUserQuiz,
    getUserQuiz,
    getUserQuizzes,
    getAllUserQuizzes,
    editUserQuiz,
    setUserQuizScore,
}
