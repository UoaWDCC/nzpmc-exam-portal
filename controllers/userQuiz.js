import { UserQuiz } from '../models'

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

const addUserQuiz = async ({ firstName, lastName, startTime, endTime }) => {
    const userQuiz = UserQuiz.init()

    userQuiz.user = firstName
    userQuiz.quiz = lastName
    userQuiz.yearLevel = yearLevel
    userQuiz.score = role
    userQuiz.startTime = startTime
    userQuiz.endTime = endTime
    userQuiz.created = new Date()
    userQuiz.modified = new Date()

    await userQuiz.save()

    return await getUser(userQuiz.id)
}
