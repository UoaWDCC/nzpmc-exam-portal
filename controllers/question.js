import { Question } from '../models'

const packQuestion = (question) => {
    return {
        key: question.key,
        id: question.id,
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

const getQuizQuestions = async (id) => {
    const question = (await Question.collection.parent(id).fetch()).list
    return packQuestions(question)
}

export { getQuizQuestions }
