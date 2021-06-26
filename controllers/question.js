import { Question } from '../models'

const packQuestion = (question) => {
    return {
        key: question.key,
        id: question.id,
        question: question.question,
        numOfAnswer: question.numOfAnswer,
        topics: question.topics,
        correct: question.correct,
        option: question.option,
        created: question.created,
        modified: question.modified,
        deleted: question.deleted,
    }
}

const packQuestions = (questions) => questions.map(packQuestion)

const getQuestions = async (quiz) => {
    const question = (await Question.collection.parent(quiz.key).fetch()).list
    return packQuestions(question)
}

const getQuestion = async (quiz) => {
    const question = await Question.collection.parent(quiz.key).get()
    return packQuestion(question)
}

const addQuestion = async (quiz, q, numOfAnswers, topics) => {
    console.log(quiz)
    const question = Question.init({ parent: quiz.key })

    question.question = q
    question.numOfAnswer = numOfAnswers
    question.topics = topics
    question.created = new Date()
    question.modified = new Date()

    await question.save()

    return await getQuestion(question.id)
}

const editQuestion = async (quiz, id, q, numOfAnswers, topics) => {
    const question = await Question.collection.parent(quiz.key).get({ id })

    question.question = q ? q : question.question
    question.numOfAnswers = numOfAnswers ? numOfAnswers : question.numOfAnswers
    question.topics = topics ? topics : question.topics
    question.modified = new Date()

    await question.update()

    return packQuiz(question)
}

export { getQuestions, addQuestion, editQuestion }
