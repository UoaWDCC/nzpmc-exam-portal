import { getRepository, runTransaction } from 'fireorm'
import {
    PackUserQuiz,
    packUserQuiz,
    packUserQuizzes,
} from '../mappers/userQuizMapper'
import { Quiz, UserQuiz, UserQuizQuestion } from '../models'
import { NotFoundError } from '../utils/errors'
import { UserQuizModel } from '@nzpmc-exam-portal/common'
import { Question } from '../models'
import { addUserQuizQuestion } from './userQuizQuestion'
import { getUser } from './user'
import { firestore } from '../utils/firebase'
import { Firestore, WriteResult } from '@google-cloud/firestore'
import { firestore as FirebaseFirestore } from 'firebase-admin'

const UserQuizRepository = getRepository(UserQuiz)

const getUserQuiz = async (userQuizID: string): Promise<UserQuizModel> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const UserQuizTranRepository = tran.getRepository(UserQuiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)
        const quiz = await QuizTranRepository.findById(userQuiz.quizID)

        const expired =
            (userQuiz.closeTime && userQuiz.closeTime < new Date()) ?? true
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
            (userQuiz.closeTime && userQuiz.closeTime < new Date()) ?? true

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
                        (userQuiz.closeTime &&
                            userQuiz.closeTime < new Date()) ??
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
        const userQuizzesPack: (PackUserQuiz | null)[] = await Promise.all(
            userQuizzes.map(async (userQuiz): Promise<PackUserQuiz | null> => {
                try {
                    const user = await getUser(userQuiz.userID)
                    if (!user) {
                        // User doesn't exist, skip processing for this userQuiz
                        return null
                    }

                    const userID = user.id
                    const quiz = await QuizTranRepository.findById(
                        userQuiz.quizID,
                    )
                    const expired =
                        (userQuiz.closeTime &&
                            userQuiz.closeTime < new Date()) ??
                        true

                    return {
                        userID,
                        quiz,
                        userQuiz,
                        expired,
                    }
                } catch (error) {
                    // Handle the error for this specific element, e.g., log it or return a default value
                    console.error(`Error processing userQuiz: ${error.message}`)
                    return null // Return null to skip processing for this userQuiz
                }
            }),
        )

        // Remove null values from the array
        const filteredUserQuizzesPack: PackUserQuiz[] = userQuizzesPack.filter(
            (pack): pack is PackUserQuiz => pack !== null,
        )
        console.log(filteredUserQuizzesPack)
        return packUserQuizzes(filteredUserQuizzesPack)
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
                        (userQuiz.closeTime &&
                            userQuiz.closeTime < new Date()) ??
                        true,
                }),
            ),
        )

        return packUserQuizzes(userQuizzesPack)
    })
}

const gradeUserQuizzes = async (input: { quizID: string }) => {
    const { quizID } = input
    try {
        await runTransaction(async (tran) => {
            const UserQuizTranRepository = tran.getRepository(UserQuiz)
            const QuizTranRepository = tran.getRepository(Quiz)
            const quiz = await QuizTranRepository.findById(quizID)
            const questions = await quiz.questions?.find()

            const userQuizzes = await UserQuizTranRepository.whereEqualTo(
                (q) => q.quizID,
                quizID,
            ).find()

            const gradingPromises = userQuizzes.map(async (userQuiz) => {
                const userQuestions = await userQuiz.questions?.find()
                userQuiz.score = gradeUserQuiz(userQuestions, questions)
                await UserQuizTranRepository.update(userQuiz)
            })

            await Promise.all(gradingPromises)
        })
    } catch (error) {
        console.error('Failed to grade user quizzes:', error)
    }
}

const gradeUserQuiz = (
    userQuestions?: UserQuizQuestion[],
    quizQuestions?: Question[],
): number | null => {
    if (!userQuestions || !quizQuestions) {
        return null
    }
    let correctAnswerCount = 0
    quizQuestions.forEach((question) => {
        if (userQuestions.find((q) => q.answerID === question.answerID)) {
            correctAnswerCount++
        }
    })
    console.log(correctAnswerCount)
    return correctAnswerCount
}

const addUserQuiz = async (
    userID: string,
    quizID: string,
    openTime: Date,
    closeTime: Date,
): Promise<UserQuizModel> => {
    //first check if userquiz already exists
    const firestore = new Firestore()

    const userQuizzesCollection = firestore.collection('UserQuizs')

    const query = userQuizzesCollection
        .where('quizID', '==', quizID)
        .where('userID', '==', userID)
        .limit(1)
    const snapshot = await query.get()
    console.log(snapshot.docs[0])
    if (!snapshot.empty) {
        return await getUserQuiz(snapshot.docs[0].id)
    }

    const userQuiz = new UserQuiz()

    userQuiz.userID = userID
    userQuiz.quizID = quizID
    if (openTime && closeTime) {
        userQuiz.openTime = openTime
        userQuiz.closeTime = closeTime
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

        ;(await questions.find()).map((question) => {
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
    closeTime?: Date,
    submitted?: boolean,
    released?: boolean,
): Promise<UserQuizModel> => {
    await UserQuizRepository.runTransaction(async (tran) => {
        const userQuiz = await tran.findById(userQuizID)
        if (!userQuiz) {
            throw new NotFoundError()
        }

        userQuiz.score = score ? score : userQuiz.score
        userQuiz.openTime = openTime ? openTime : userQuiz.openTime
        userQuiz.closeTime = closeTime ? closeTime : userQuiz.closeTime
        userQuiz.quizStart = quizStart ? quizStart : userQuiz.quizStart
        // default value false if document doesn't have the flags
        userQuiz.submitted = submitted ? submitted : userQuiz.submitted ?? false
        userQuiz.released = released ? released : userQuiz.released
        userQuiz.modified = new Date()

        tran.update(userQuiz)
    })

    return await getUserQuiz(userQuizID)
}
const deleteUserQuiz = async (quizid: string, userid: string) => {
    try {
        // Query 'userquizs' collection with the given parameters
        let userQuizID: string | null = null // Initialize with a default value
        let querySnapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData> | null =
            null
        console.log(`Deleting for user ${userid} and quiz ${quizid}`)
        if (quizid === 'all' && userid !== null) {
            // delete all userquizs for a user
            querySnapshot = await firestore
                .collection('UserQuizs')
                .where('userID', '==', userid)
                .get()
        } else if (quizid !== null && userid === 'all') {
            // delete all userquizs for a quiz
            querySnapshot = await firestore
                .collection('UserQuizs')
                .where('quizID', '==', quizid)
                .get()
        } else {
            // delete a user quiz for a given quiz and user
            querySnapshot = await firestore
                .collection('UserQuizs')
                .where('quizID', '==', quizid)
                .where('userID', '==', userid)
                .get()
        }

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
        console.log(`Amount of deleted quizzes: ${deletePromises.length}`)
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
    gradeUserQuizzes,
    deleteUserQuiz,
    editUserQuiz,
    setUserQuizScore,
}
