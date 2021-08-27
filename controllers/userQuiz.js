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
    if (startTime && endTime) {
        userQuiz.startTime = startTime
        userQuiz.endTime = endTime
    }
    userQuiz.created = new Date()
    userQuiz.modified = new Date()

    await userQuiz.save()

    return await getUserQuiz(userQuiz.id)
}

const editUserQuiz = async (userQuizID, score, startTime, endTime) => {
    const userQuizObj = await UserQuiz.collection.get({ id: userQuizID })

    userQuizObj.score = score ? score : userQuizObj.score
    userQuizObj.startTime = startTime
        ? startTime
        : userQuizObj.startTime
        ? userQuizObj.startTime.toDate()
        : null

    userQuizObj.endTime = endTime
        ? endTime
        : userQuizObj.endTime
        ? userQuizObj.endTime.toDate()
        : null

    userQuizObj.created = userQuizObj.created.toDate()
    userQuizObj.modified = userQuizObj.modified.toDate()

    userQuizObj.user = (await userQuizObj.user.get()).key
    userQuizObj.quiz = (await userQuizObj.quiz.get()).key

    await userQuizObj.update()

    return await getUserQuiz(userQuizID)
}

const setUserQuizScore = async (userQuizID, score) => {
    let userQuizObj = await getUserQuiz(userQuizID)

    userQuizObj.score = score
    userQuizObj.startTime = new Date(userQuizObj.startTime._seconds * 1000)
    userQuizObj.endTime = new Date(userQuizObj.endTime._seconds * 1000)
    userQuizObj.created = new Date(userQuizObj.created._seconds * 1000)
    userQuizObj.modified = new Date()
    userQuizObj.user = userQuizObj.userObj.ref._path.segments.join('/')
    userQuizObj.quiz = userQuizObj.quizObj.ref._path.segments.join('/')

    let userQuiz = UserQuiz.fromObject(userQuizObj)
    await userQuiz.save()

    return await getUserQuiz(userQuizID)
}

export {
    addUserQuiz,
    getUserQuiz,
    getUserQuizzes,
    getAllUserQuizzes,
    editUserQuiz,
    setUserQuizScore,
}
