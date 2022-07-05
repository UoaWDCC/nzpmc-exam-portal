import { Quiz, UserQuiz, UserQuizQuestion } from '../models'
import { getUserQuiz, setUserQuizScore } from './userQuiz'
import { runTransaction } from 'fireorm'
import * as Schema from '../resolvers/resolvers-types'
import { NotFoundError } from '../utils/errors'
import {
    PackQuizQuestion,
    packUserQuizQuestion,
    packUserQuizQuestions,
} from '../mappers/userQuizQuestionMapper'
import { packOption, packOptions } from '../mappers/optionMapper'
import { UserQuizQuestionModel } from '../resolvers/custom/userQuizQuestionModel'

const getUserQuizQuestion = async (
    userQuizID: string,
    id: string,
): Promise<UserQuizQuestionModel> => {
    let userQuiz
    let quizQuestion
    await runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        userQuiz = await UserQuizTranRepository.findById(userQuizID)
        if (!userQuiz || !userQuiz.questions) {
            throw new NotFoundError()
        }

        const quiz = await QuizTranRepository.findById(userQuiz.quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        quizQuestion = await quiz.questions.findById(id)
        if (!quizQuestion) {
            throw new NotFoundError()
        }
    })

    let userQuizQuestion = await userQuiz.questions.findById(id)
    if (!userQuizQuestion) {
        // if this doesn't exist create it
        userQuizQuestion = addUserQuizQuestion(userQuiz.id, quizQuestion.id)
    }

    return packUserQuizQuestion({
        userQuizID,
        quizQuestion,
        userQuizQuestion,
    })
}

const getUserQuizQuestions = async (
    userQuizID: string,
): Promise<UserQuizQuestionModel[]> => {
    let quizQuestions
    let userQuiz
    await runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        userQuiz = await UserQuizTranRepository.findById(userQuizID)

        const quiz = await QuizTranRepository.findById(userQuiz.quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        quizQuestions = await quiz.questions.find()
    })

    const userQuizQuestions: PackQuizQuestion[] = await Promise.all(
        quizQuestions.map(async (quizQuestion) => {
            if (!userQuiz || !userQuiz.questions) {
                throw new NotFoundError()
            }
            let userQuizQuestion = await userQuiz.questions.findById(
                quizQuestion.id,
            )
            if (!userQuizQuestion) {
                // if this doesn't exist create it
                userQuizQuestion = addUserQuizQuestion(
                    userQuiz.id,
                    quizQuestion.id,
                )
            }

            return {
                userQuizID,
                quizQuestion,
                userQuizQuestion,
            }
        }),
    )
    return packUserQuizQuestions(userQuizQuestions)
}

const addUserQuizQuestion = async (
    userQuizID: string,
    questionID: string,
): Promise<UserQuizQuestionModel> => {
    let userQuizQuestionID: string | undefined
    await runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)
        if (!userQuiz || !userQuiz.questions) {
            throw new NotFoundError()
        }

        const quiz = await QuizTranRepository.findById(userQuiz.quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(questionID)
        if (!question) {
            throw new NotFoundError()
        }

        const userQuizQuestion = new UserQuizQuestion()
        userQuizQuestion.id = question.id
        userQuizQuestion.questionID = question.id
        userQuizQuestion.answerID = null
        userQuizQuestion.firstViewed = null
        userQuizQuestion.lastAnswered = null

        const newUserQuizQuestion = await userQuiz.questions.create(
            userQuizQuestion,
        )
        userQuizQuestionID = newUserQuizQuestion.id
    })

    if (!userQuizQuestionID) {
        throw new NotFoundError()
    }

    return await getUserQuizQuestion(userQuizID, userQuizQuestionID)
}

const editUserQuizQuestion = async (
    userQuizID: string,
    questionID: string,
    optionID?: string,
    flag?: boolean,
): Promise<UserQuizQuestionModel> => {
    return runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)
        if (!userQuiz || !userQuiz.questions) {
            throw new NotFoundError()
        }

        const quiz = await QuizTranRepository.findById(userQuiz.quizID)
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
        userQuizQuestion.questionID = question.id
        userQuizQuestion.answerID = optionID ?? userQuizQuestion.answerID
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

        const quiz = await QuizTranRepository.findById(userQuiz.quizID)
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

const getUserQuizQuestionAnswer = async (
    userQuizID: string,
    questionID: string,
): Promise<Schema.Option | null> => {
    return runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)
        if (!userQuiz || !userQuiz.questions) {
            throw new NotFoundError()
        }

        const quiz = await QuizTranRepository.findById(userQuiz.quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const quizQuestion = await quiz.questions.findById(questionID)
        if (!quizQuestion || !quizQuestion.options) {
            throw new NotFoundError()
        }

        const userQuizQuestion = await userQuiz.questions.findById(questionID)
        if (!userQuizQuestion || !userQuizQuestion.answerID) {
            return null
        }

        const option = await quizQuestion.options.findById(
            userQuizQuestion.answerID,
        )
        if (!option) {
            return null
        }

        return packOption(option)
    })
}

interface UserAnswers {
    userAnswerIDs: string[]
    correctAnswerIDs: string[]
}

const getUserAnswers = (userQuizID: string): Promise<UserAnswers> => {
    return runTransaction(async (tran) => {
        const UserQuizTranRepository = tran.getRepository(UserQuiz)
        const QuizTranRepository = tran.getRepository(Quiz)

        const userQuiz = await UserQuizTranRepository.findById(userQuizID)
        if (!userQuiz || !userQuiz.questions) {
            throw new NotFoundError()
        }

        const quiz = await QuizTranRepository.findById(userQuiz.quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const userQuizQuestions = await getUserQuizQuestions(userQuizID)

        const userAnswerIDs = await Promise.all(
            userQuizQuestions.map(async (userQuizQuestion) => {
                const userQuestion = await userQuiz.questions?.findById(
                    userQuizQuestion.id,
                )
                if (!userQuestion || !userQuestion.answerID) {
                    return ''
                }
                return userQuestion.answerID
            }),
        )

        const correctAnswerIDs = await Promise.all(
            userQuizQuestions.map(async (userQuizQuestion) => {
                const question = await quiz.questions?.findById(
                    userQuizQuestion.id,
                )
                if (!question) {
                    // Each question should have a correct answer
                    throw new NotFoundError()
                }
                return question.answerID
            }),
        )

        return {
            userAnswerIDs,
            correctAnswerIDs,
        }
    })
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
    getUserQuizQuestionAnswer,
    submitUserQuizQuestions,
    getUserAnswers,
}
