import { UserQuiz } from '../models'
import { getUser } from './user'

const packUserQuiz = async (userquiz) => {
    const quiz = await userquiz.quiz.get()
    return {
        key: userquiz.key,
        id: userquiz.id,
        userObj: userquiz.user,
        quizObj: userquiz.quiz,
        name: quiz.name,
        description: quiz.description,
        duration: quiz.duration,
        score: userquiz.score,
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

const getUserQuizzes = async (id) => {
    const user = await getUser(id)

    const userQuizzes = (
        await UserQuiz.collection.where('user', '==', user.key).fetch()
    ).list

    return packUserQuizzes(userQuizzes)
}

const getAllUserQuizzes = async () => {
    const userQuizzes = (await UserQuiz.collection.fetch()).list
    return packUserQuizzes(userQuizzes)
}

const addUserQuiz = async (user, quiz, startTime, endTime) => {
    const userQuiz = UserQuiz.init()

    userQuiz.user = user.key
    userQuiz.quiz = quiz.key
    userQuiz.startTime = startTime
    userQuiz.endTime = endTime
    userQuiz.created = new Date()
    userQuiz.modified = new Date()

    await userQuiz.save()

    return await getUserQuiz(userQuiz.id)
}

export { addUserQuiz, getUserQuiz, getUserQuizzes, getAllUserQuizzes }
