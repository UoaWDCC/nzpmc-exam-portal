import { Model, Field } from 'fireo'

class Question extends Model {
    super() {
        this.question = Field.Text()
        this.noAnswer = Field.Number()
        this.topics = Field.Text()
        this.correct = Field.Reference()
        this.option = Field.List()
        this.created = Field.Timestamp()
        this.modified = Field.Timestamp()
        this.deleted = Field.Timestamp()
    }
}

export default Question
