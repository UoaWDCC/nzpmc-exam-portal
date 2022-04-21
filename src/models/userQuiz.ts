import { SubCollection, ISubCollection, Collection, Type } from 'fireorm'
import UserQuizQuestion from './userQuizQuestion'
import { FirestoreDocumentReference } from './utils'

@Collection()
class UserQuiz {
    id!: string

    @Type(() => FirestoreDocumentReference)
    user!: FirestoreDocumentReference

    @Type(() => FirestoreDocumentReference)
    quiz!: FirestoreDocumentReference

    score?: number

    startTime?: Date
    endTime?: Date

    @SubCollection(UserQuizQuestion, 'Question')
    questions?: ISubCollection<UserQuizQuestion>
    created: Date = new Date()
    modified: Date = new Date()
    deleted: Date | null = null
}

export default UserQuiz
