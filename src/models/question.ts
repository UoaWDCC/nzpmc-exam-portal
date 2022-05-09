import { IsDataURI } from 'class-validator'
import { ISubCollection, SubCollection } from 'fireorm'
import Option from './option'

class Question {
    id!: string
    question!: string

    @IsDataURI()
    imageURI!: string
    numOfAnswers!: number
    topics!: string

    answerID!: string

    @SubCollection(Option, 'Option')
    options?: ISubCollection<Option>

    created: Date = new Date()
    modified: Date = new Date()
    deleted: Date | null = null
}

export default Question
