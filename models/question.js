import { Model, Field } from 'fireo'

class Question extends Model {
    id = Field.ID()
    question = Field.Text({ required: true })
    numOfAnswer = Field.Number({ required: true })
    topics = Field.Text({ required: true })
    correct = Field.Reference({ required: true })
    option = Field.List({ required: true })
    created = Field.DateTime({ required: true })
    modified = Field.DateTime({ required: true })
    deleted = Field.DateTime()
}

export default Question
