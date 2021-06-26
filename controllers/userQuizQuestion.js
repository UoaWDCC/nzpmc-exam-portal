import { Option, Question, Quiz, UserQuizQuestion } from '../models'
import { packOptions } from './option'

const getUserQuizQuestion = async (userQuiz, id) => {
    const quiz = await userQuiz.quizObj.get()

    const quizQuestion = await Question.collection.parent(quiz.key).get({ id })

    const userQuizQuestion = await UserQuizQuestion.collection
        .parent(userQuiz.key)
        .get({ id })

    return {
        id: quizQuestion.id,
        question: quizQuestion.question,
        questionKey: quizQuestion.key,
        questionObj: quizQuestion,
        userAnswerKey: userQuizQuestion ? userQuizQuestion.key : null,
        userAnswerObj: userQuizQuestion,
    }
}

const getUserQuizQuestions = async (userQuiz) => {
    const quiz = await userQuiz.quizObj.get()
    const quizQuestions = (await Question.collection.parent(quiz.key).fetch())
        .list

    const userQuizQuestions = (
        await UserQuizQuestion.collection.parent(userQuiz.key).fetch()
    ).list

    const userQuizQuestionsMap = userQuizQuestions.reduce((map, question) => {
        map[question.id] = question
    }, {})

    return quizQuestions.map((quizQuestion) => {
        let userQuizQuestion = userQuizQuestionsMap[quizQuestion.id]
        if (!userQuizQuestion) {
            return {
                id: quizQuestion.id,
                question: quizQuestion.question,
                questionKey: quizQuestion.key,
                questionObj: quizQuestion,
            }
        }
        return {
            id: quizQuestion.id,
            question: quizQuestion.question,
            questionKey: quizQuestion.key,
            questionObj: quizQuestion,
            userAnswerKey: userQuizQuestion.key,
            userAnswerObj: userQuizQuestion,
        }
    })
}

const addUserQuizQuestion = async (userQuiz, question) => {
    const userQuizQuestion = UserQuizQuestion.init({ parent: userQuiz.key })

    userQuizQuestion.id = question.id
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

    return await getUserQuizQuestionOptionsByQuestion(question)
}

const getUserQuizQuestionOptionsByQuestion = async (question) => {
    if (!question.answer.ref) return []
    const answer = await question.answer.get()

    const options = (await Option.collection.parent(question.key).fetch()).list

    let answers = [answer, ...options]

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
    getUserQuizQuestionOptionsByQuestion,
}
