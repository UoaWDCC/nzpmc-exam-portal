import { Question } from '../models'
import { Question as SchemaQuestion } from '../resolvers/resolvers-types'

const packQuestion = (question: Question): SchemaQuestion => {
    return {
        id: question.id,
        question: question.question,
        imageURI: question.imageURI,
        numOfAnswers: question.numOfAnswers,
        topics: question.topics,
        //option: question.option, //TODO FIX
        created: question.created,
        modified: question.modified,
    }
}

const packQuestions = (questions: Question[]): SchemaQuestion[] =>
    questions.map(packQuestion)

export { packQuestion, packQuestions }
