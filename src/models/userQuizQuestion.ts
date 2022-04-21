import { Type } from 'fireorm'
import { FirestoreDocumentReference } from './utils'

class UserQuizQuestion {
    id!: string

    @Type(() => FirestoreDocumentReference)
    question!: FirestoreDocumentReference

    @Type(() => FirestoreDocumentReference)
    answer: FirestoreDocumentReference | null = null

    flag = false
    firstViewed: Date | null = null
    lastAnswered: Date | null = null

    created: Date = new Date()
    modified: Date = new Date()
    deleted: Date | null = null
}

export default UserQuizQuestion
