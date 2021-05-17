import { Model, Field } from 'fireo'

class Quiz extends Model {
    super() {
        this.name = Field.Text()
        this.description = Field.Text()
        this.duration = Field.Number()
        this.noQuestions = Field.Number()
        this.questions = Field.Array()
        this.startTime = Field.Timestamp()
        this.endTime = Field.Timestamp()
        this.createdAt = Field.Timestamp()
        this.modifiedAt = Field.Timestamp()
        this.deleted = Field.Timestamp()
    }
}

export default Quiz
