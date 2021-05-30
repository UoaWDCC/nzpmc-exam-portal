import { Fireo } from 'fireo'
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

const getQuestion = async (id) => {
    const question = await Question.collection.get({ id })
    return packQuestion(Question)
}

const getAllQuestions = async (id) => {
    const questions = (
        await Question.collection.fetch()
    ).list
    return packQuestions(questions)
}

export {getQuestion, getAllQuestions}