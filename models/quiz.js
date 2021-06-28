import { Model, Field } from 'fireo'

class Quiz extends Model {
    id = Field.ID()
    name = Field.Text({ required: true })
    description = Field.Text({ required: true })
    duration = Field.Number({ required: true })
    numOfQuestions = Field.Number({ required: true })
    startTime = Field.DateTime({ required: true })
    endTime = Field.DateTime({ required: true })
    createdAt = Field.DateTime({ required: true, auto: true })
    modifiedAt = Field.DateTime({ required: true, auto: true })
    deleted = Field.DateTime()
}

export default Quiz
