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

const addQuiz = async (
    name,
    description,
    duration,
    numOfQuestions,
    startTime,
    endTime,
) => {
    const quiz = Quiz.init()

    quiz.name = name
    quiz.description = description
    quiz.duration = duration
    quiz.numOfQuestions = numOfQuestions
    quiz.startTime = startTime
    quiz.endTime = endTime
    quiz.created = new Date()
    quiz.modified = new Date()

    await quiz.save()

    return await getQuiz(quiz.id)
}

const editQuiz = async (
    name,
    description,
    duration,
    numOfQuestions,
    startTime,
    endTime,
) => {
    return await Fireo.runTransaction(async (t) => {
        const quiz = await getQuiz(id)

        quiz.name = name ? name : quiz.name
        quiz.description = description ? description : quiz.description
        quiz.duration = duration ? duration : quiz.duration
        quiz.numOfQuestions = numOfQuestions
            ? numOfQuestions
            : quiz.numOfQuestions
        quiz.startTime = startTime ? startTime : quiz.startTime
        quiz.endTime = endTime ? endTime : quiz.endTime
        quiz.modified = new Date()

        await quiz.update()

        return quiz
    })
}

export { getAllQuizzes, addQuiz, editQuiz }
