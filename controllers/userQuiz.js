import { Quiz, UserQuiz } from '../models'

const packUserQuiz = async (userquiz) => {
    const quiz = await Quiz.collection.get({ id: userquiz.quiz.id })
    return {
        key: userquiz.key,
        id: userquiz.id,
        userID: userquiz.user.id,
        name: quiz.name,
        description: quiz.description,
        duration: quiz.duration,
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

const addUserQuiz = async (user, quiz, startTime, endTime) => {
    const userQuiz = UserQuiz.init()

    userQuiz.user = user.key
    userQuiz.quiz = quiz.key
    userQuiz.yearLevel = yearLevel
    userQuiz.score = 0.0
    userQuiz.startTime = startTime
    userQuiz.endTime = endTime
    userQuiz.created = new Date()
    userQuiz.modified = new Date()

    await userQuiz.save()

    return await getUserQuiz(userQuiz.id)
}

export { addUserQuiz, getUserQuiz, getAllUserQuizzes }
