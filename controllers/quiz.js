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

export { getAllQuizzes }
