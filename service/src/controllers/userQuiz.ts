import { getRepository, runTransaction } from 'fireorm'
import {
    PackUserQuiz,
    packUserQuiz,
    packUserQuizzes,
} from '../mappers/userQuizMapper'
import { Quiz, UserQuiz } from '../models'
import { NotFoundError } from '../utils/errors'
import { UserQuizModel } from '@nzpmc-exam-portal/common'
import { addUserQuizQuestion } from './userQuizQuestion'
import { getUser } from './user'
import { firestore } from '../utils/firebase'
import { WriteResult } from '@google-cloud/firestore'

const UserQuizRepository = getRepository(UserQuiz)

const getUserQuiz = async (userQuizID: string): Promise<UserQuizModel> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const UserQuizTranRepository = tran.getRepository(UserQuiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)
        const quiz = await QuizTranRepository.findById(userQuiz.quizID)

        const expired =
            (userQuiz.endTime && userQuiz.endTime < new Date()) ?? true

        return packUserQuiz({
            userID: userQuiz.userID,
            quiz,
            userQuiz,
            expired,
        })
    })
}

const getUserQuizbyQuizID = async (quizID: string): Promise<UserQuizModel> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const UserQuizTranRepository = tran.getRepository(UserQuiz)

        const userQuiz: UserQuiz | null =
            await UserQuizTranRepository.whereEqualTo(
                'quizID',
                quizID,
            ).findOne()

        if (!userQuiz) {
            throw new NotFoundError()
        }

        const quiz = await QuizTranRepository.findById(userQuiz.quizID)

        const expired =
            (userQuiz.endTime && userQuiz.endTime < new Date()) ?? true

        return packUserQuiz({
            userID: userQuiz.userID,
            quiz,
            userQuiz,
            expired,
        })
    })
}

const getUserQuizzes = async (userID: string): Promise<UserQuizModel[]> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const UserQuizTranRepository = tran.getRepository(UserQuiz)

        const quizzes = await UserQuizTranRepository.whereEqualTo(
            (q) => q.userID,
            userID,
        ).find()

        const userQuizzesPack: PackUserQuiz[] = await Promise.all(
            quizzes.map(
                async (userQuiz): Promise<PackUserQuiz> => ({
                    userID,
                    quiz: await QuizTranRepository.findById(userQuiz.quizID),
                    userQuiz,
                    expired:
                        (userQuiz.endTime && userQuiz.endTime < new Date()) ??
                        true,
                }),
            ),
        )

        return packUserQuizzes(userQuizzesPack)
    })
}

const getUserQuizzesByQuizID = async (
    quizID: string,
): Promise<UserQuizModel[]> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const UserQuizTranRepository = tran.getRepository(UserQuiz)

        const userQuizzes = await UserQuizTranRepository.whereEqualTo(
            (q) => q.quizID,
            quizID,
        ).find()

        const userQuizzesPack: PackUserQuiz[] = await Promise.all(
            userQuizzes.map(
                async (userQuiz): Promise<PackUserQuiz> => ({
                    userID: (await getUser(userQuiz.userID)).id,
                    quiz: await QuizTranRepository.findById(userQuiz.quizID),
                    userQuiz,
                    expired:
                        (userQuiz.endTime && userQuiz.endTime < new Date()) ??
                        true,
                }),
            ),
        )

        return packUserQuizzes(userQuizzesPack)
    })
}

const getAllUserQuizzes = async (): Promise<UserQuizModel[]> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const UserQuizTranRepository = tran.getRepository(UserQuiz)

        const quizzes = await UserQuizTranRepository.find()

        const userQuizzesPack: PackUserQuiz[] = await Promise.all(
            quizzes.map(
                async (userQuiz): Promise<PackUserQuiz> => ({
                    userID: userQuiz.userID,
                    quiz: await QuizTranRepository.findById(userQuiz.quizID),
                    userQuiz,
                    expired:
                        (userQuiz.endTime && userQuiz.endTime < new Date()) ??
                        true,
                }),
            ),
        )

        return packUserQuizzes(userQuizzesPack)
    })
}

const addUserQuiz = async (
    userID: string,
    quizID: string,
    openTime: Date,
    endTime: Date,
): Promise<UserQuizModel> => {
    const userQuiz = new UserQuiz()

    userQuiz.userID = userID
    userQuiz.quizID = quizID
    if (openTime && endTime) {
        userQuiz.openTime = openTime
        userQuiz.endTime = endTime
    }
    userQuiz.created = new Date()
    userQuiz.modified = new Date()
    userQuiz.quizStart = null

    UserQuizRepository.create(userQuiz)

    runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)

        const questions = (await QuizTranRepository.findById(quizID)).questions
        if (!questions) {
            throw new NotFoundError()
        }

        ; (await questions.find()).map((question) => {
            addUserQuizQuestion(userQuiz.id, question.id)
        })
    })

    return await getUserQuiz(userQuiz.id)
}

const editUserQuiz = async (
    userQuizID: string,
    quizStart?: number,
    score?: number,
    openTime?: Date,
    endTime?: Date,
    submitted?: boolean,
): Promise<UserQuizModel> => {
    await UserQuizRepository.runTransaction(async (tran) => {
        const userQuiz = await tran.findById(userQuizID)
        if (!userQuiz) {
            throw new NotFoundError()
        }

        userQuiz.score = score ? score : userQuiz.score
        userQuiz.openTime = openTime ? openTime : userQuiz.openTime
        userQuiz.endTime = endTime ? endTime : userQuiz.endTime
        userQuiz.quizStart = quizStart ? quizStart : userQuiz.quizStart
        // default value false if document doesn't have a submitted flag
        userQuiz.submitted = submitted ? submitted : userQuiz.submitted ?? false
        userQuiz.modified = new Date()

        tran.update(userQuiz)
    })

    return await getUserQuiz(userQuizID)
}
const deleteUserQuiz = async (quizid: string, userid: string) => {
    try {
        // Query 'userquizs' collection with the given parameters
        let userQuizID: string | null = null // Initialize with a default value

        const querySnapshot = await firestore
            .collection('UserQuizs')
            .where('quizID', '==', quizid)
            .where('userID', '==', userid)
            .get()

        // Delete each matching document
        const deletePromises: Promise<WriteResult>[] = []
        querySnapshot.forEach((doc) => {
            deletePromises.push(doc.ref.delete())
            userQuizID = doc.id
        })

        // Wait for all deletions to complete
        await Promise.all(deletePromises)

        if (userQuizID === null) {
            // Handle the case when no matching documents are found
            console.log('No matching documents found.')
            return null
        }

        console.log('Documents successfully deleted!')
        return userQuizID
    } catch (error) {
        console.error('Error deleting documents:', error)
        throw error
    }
}

const setUserQuizScore = (
    userQuizID: string,
    score: number,
): Promise<UserQuizModel> => {
    return editUserQuiz(userQuizID, undefined, score, undefined, undefined)
}

export {
    addUserQuiz,
    getUserQuiz,
    getUserQuizzes,
    getUserQuizbyQuizID,
    getUserQuizzesByQuizID,
    getAllUserQuizzes,
    deleteUserQuiz,
    editUserQuiz,
    setUserQuizScore,
}
