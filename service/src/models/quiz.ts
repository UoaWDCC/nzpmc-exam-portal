import { Collection, ISubCollection, SubCollection } from 'fireorm'
import Question from './question'

@Collection()
class Quiz {
    id!: string
    name!: string
    description!: string
    duration!: number
    openTime!: Date
    closeTime!: Date
    released: boolean | null = false

    @SubCollection(Question, 'Question')
    questions?: ISubCollection<Question>
    questionIDsOrder: string[] = []
    created: Date = new Date()
    modified: Date = new Date()
    deleted: Date | null = null
}

export default Quiz
