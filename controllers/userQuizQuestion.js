import { Quiz, UserQuizQuestion } from '../models'

const packUserQuizQuestion = (answer) => {
    const question = answer.question.get()

    return {
        key: answer.key,
        id: answer.id,
        question: question.question,
        questionKey: question.key,
        userAnswerKey: answer.userAnswer.key,
    }
}

const packUserQuizQuestions = (answers) => answers.map(packUserQuizQuestion)

const getUserQuizQuestion = async (userQuiz, id) => {
    const userQuizQuestion = await UserQuizQuestion.collection
        .parent(userQuiz.key)
        .get({ id: id })
    return packUserQuizQuestion(userQuizQuestion)
}

const getUserQuizQuestions = async (userQuiz) => {
    const userQuizQuestions = (
        await UserQuizQuestion.collection.parent(userQuiz.key).fetch()
    ).list
    return packUserQuizQuestions(userQuizQuestions)
}

const addUserQuizQuestion = async (userQuiz, question) => {
    const userQuizQuestion = UserQuizQuestion.init({ parent: userQuiz.key })

    userQuizQuestion.question = question.key
    userQuizQuestion.answer = null
    userQuizQuestion.firstViewed = null
    userQuizQuestion.lastAnswered = null

    await UserQuizQuestion.save()

    return await getUserQuizQuestion(UserQuizQuestion.id)
}

const editUserQuizQuestion = async (userQuiz, id, answer) => {
    return await Fireo.runTransaction(async (t) => {
        const userQuizQuestion = await UserQuizQuestion.collection
            .parent(userQuiz.key)
            .get({
                id: id,
                transaction: t,
            })
        userQuizQuestion.answer = answer.key
        userQuizQuestion.firstViewed = userQuizQuestion.firstViewed
            ? userQuizQuestion.firstViewed
            : new Date()
        userQuizQuestion.lastAnswered = answer
            ? new Date()
            : userQuizQuestion.lastAnswered
        await city.update({ transaction: t })
    })
}

const getUserQuizQuestionOptions = async (quizQuestion) => {
    const userQuizQuestion = await UserQuizQuestion.collection.get({
        key: quizQuestion.key,
    })

    const question = await userQuizQuestion.question.get()

    const correct = await question.correct.get()

    const options = (await Option.collection.parent(question.key).fetch()).list

    answers = [correct, ...options]

    let count = answers.length,
        randomnumber,
        temp
    while (count) {
        randomnumber = (Math.random() * count--) | 0
        temp = answers[count]
        answers[count] = answers[randomnumber]
        answers[randomnumber] = temp
    }

    return packOptions(answers)
}

export {
    getUserQuizQuestion,
    getUserQuizQuestions,
    addUserQuizQuestion,
    editUserQuizQuestion,
    getUserQuizQuestionOptions,
}
