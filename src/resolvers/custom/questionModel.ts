import { FirestoreDocumentReference } from '../../models/utils'

export type QuestionModel = {
    quizID: string
    id: string
    question: string
    imageURI: string
    numOfAnswers: number
    topics: string
    answer: FirestoreDocumentReference
    created: Date
    modified: Date
}
