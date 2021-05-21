import { Model, Field } from 'fireo'

class Question extends Model {
    super() {
        this.question = Field.Text({ required: true })
        this.noAnswer = Field.Number({ required: true })
        this.topics = Field.Text({ required: true })
        this.correct = Field.Reference({ required: true })
        this.option = Field.List({ required: true })
        this.created = Field.Timestamp({ required: true })
        this.modified = Field.Timestamp({ required: true })
        this.deleted = Field.Timestamp()
    }
}

export default Question
