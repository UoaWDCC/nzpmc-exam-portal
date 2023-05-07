import { Question } from '../models'
import { QuestionModel } from '@nzpmc-exam-portal/common'

interface PackQuestion {
    quizID: string
    question: Question
}

const packQuestion = ({ quizID, question }: PackQuestion): QuestionModel => {
    return {
        quizID,
        id: question.id,
        question: question.question,
        imageURI: question.imageURI,
        numOfAnswers: question.numOfAnswers,
        topics: question.topics,
        answerID: question.answerID,
        created: question.created,
        modified: question.modified,
    }
}

const packQuestions = (questions: PackQuestion[]): QuestionModel[] =>
    questions.map(packQuestion)

export { packQuestion, packQuestions }
