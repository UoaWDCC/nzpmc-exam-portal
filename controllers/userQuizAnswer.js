import { Quiz, UserQuizAnswer } from '../models'

const packUserQuizAnswer = (answer) => {
    return {
        key: answer.key,
        id: answer.id,
        questionID: answer.question.id,
        answerID: answer.answer.id,
    }
}

const packUserQuizAnswers = (answers) => answer.map(packUserQuizAnswer)

const getUserQuizAnswer = async (userQuiz, id) => {
    const userQuizAnswer = await UserQuizAnswer.collection
        .parent(userQuiz.key)
        .get({ id: id })
    return packUserQuizAnswer(userQuizAnswer)
}

const getUserQuizAnswers = async (userQuiz, id) => {
    const userQuizAnswers = (
        await UserQuizAnswer.collection.parent(userQuiz.key).fetch()
    ).list
    return packUserQuizAnswers(userQuizAnswers)
}

const addUserQuizAnswer = async (userQuiz, question) => {
    const userQuizAnswer = UserQuizAnswer.init({ parent: quiz.key })

    userQuizAnswer.question = question.key
    userQuizAnswer.answer = null
    userQuizAnswer.firstViewed = null
    userQuizAnswer.lastAnswered = null

    await userQuizAnswer.save()

    return await getUserQuizAnswer(userQuizAnswer.id)
}

const editUserQuizAnswer = async (userQuiz, id, answer) => {
    return await Fireo.runTransaction(async (t) => {
        const userQuizAnswer = await UserQuizAnswer.collection
            .parent(quiz.key)
            .get({
                id: id,
                transaction: t,
            })
        userQuizAnswer.answer = answer.key
        userQuizAnswer.firstViewed = userQuizAnswer.firstViewed
            ? userQuizAnswer.firstViewed
            : new Date()
        userQuizAnswer.lastAnswered = answer
            ? new Date()
            : userQuizAnswer.lastAnswered
        await city.update({ transaction: t })
    })
}

export {
    getUserQuizAnswer,
    getUserQuizAnswers,
    addUserQuizAnswer,
    editUserQuizAnswer,
}
