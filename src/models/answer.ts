import { Collection } from 'fireorm'

@Collection()
class Answer {
    id!: string
    option!: string
    created: Date = new Date()
    modified: Date = new Date()
    deleted: Date | null = null
}

export default Answer
