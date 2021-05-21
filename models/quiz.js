import { Model, Field } from 'fireo'

class Quiz extends Model {
    super() {
        this.name = Field.Text({ required: true })
        this.description = Field.Text({ required: true })
        this.duration = Field.Number({ required: true })
        this.noQuestions = Field.Number({ required: true })
        this.questions = Field.Array({ required: true })
        this.startTime = Field.Timestamp({ required: true })
        this.endTime = Field.Timestamp({ required: true })
        this.createdAt = Field.Timestamp({ required: true })
        this.modifiedAt = Field.Timestamp({ required: true })
        this.deleted = Field.Timestamp()
    }
}

export default Quiz
