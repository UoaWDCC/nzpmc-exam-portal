import { IsDataURI } from 'class-validator'
import { ISubCollection, SubCollection, Type } from 'fireorm'
import Option from './option'
import { FirestoreDocumentReference } from './utils'

class Question {
    id!: string
    question!: string

    @IsDataURI()
    imageURI!: string
    numOfAnswers!: number
    topics!: string

    @Type(() => FirestoreDocumentReference)
    answer!: FirestoreDocumentReference

    @SubCollection(Option, 'Option')
    options?: ISubCollection<Option>

    created: Date = new Date()
    modified: Date = new Date()
    deleted: Date | null = null
}

export default Question
