import { Fireo } from 'fireo'
import { UserQuiz, Quiz } from '../models'

const packQuiz = (quiz) => {
    return {
        key: quiz.key,
        id: quiz.id,
        description: quiz.description,
        duration: quiz.duration,
        numOfQuestions: quiz.numOfQuestions,
        startTime: quiz.startTime,
        endTime: quiz.endTime,
        created: quiz.created,
        modified: quiz.modified,
    }
}

const packQuizzes = (quizzes) => quizzes.map(packQuiz)

const getQuiz = async (id) => {
    const quiz = await Quiz.collection.get({ id })
    return packQuiz(quiz)
}

const getAllQuizzes = async () => {
    const quizzes = (await Quiz.collection.fetch()).list
    return packQuizzes(quizzes)
}

const addQuiz = async ({ firstName, lastName, yearLevel, role }) => {
    const quiz = Quiz.init()

    quiz.firstName = firstName
    quiz.lastName = lastName
    quiz.yearLevel = yearLevel
    quiz.role = role
    quiz.created = new Date()
    quiz.modified = new Date()

    await quiz.save()

    return await getQuiz(quiz.id)
}

const editQuiz = async ({ id, firstName, lastName, yearLevel }) => {
    return await Fireo.runTransaction(async (t) => {
        const quiz = getQuiz(id)

        quiz.firstName = firstName ? firstName : quiz.firstName
        quiz.lastName = lastName ? lastName : quiz.lastName
        quiz.yearLevel = yearLevel ? yearLevel : quiz.yearLevel
        quiz.modified = new Date()

        await quiz.update()

        return quiz
    })
}

const packUserQuiz = (userquiz) => {
    return {
        key: userquiz.key,
        id: userquiz.id,
        quiz: userquiz.quiz,
        answers: userquiz.quiz,
        score: userquiz.quiz,
        startTime: userquiz.startTime,
        endTime: userquiz.endTime,
        created: userquiz.created,
        modified: userquiz.modified,
    }
}

const packUserQuizzes = (quizzes) => quizzes.map(packUserQuiz)

const getUserQuiz = async (id) => {
    const quiz = await UserQuiz.collection.get({ id })
    return packUserQuiz(quiz)
}

const getAllUserQuizzes = async () => {
    const userQuizzes = (await UserQuiz.collection.fetch()).list
    return packUserQuizzes(userQuizzes)
}

export { getUserQuiz, getAllQuizzes, getAllUserQuizzes }
