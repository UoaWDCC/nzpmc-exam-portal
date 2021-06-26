import { Model, Field } from 'fireo'

class UserQuiz extends Model {
    id = Field.ID()
    user = Field.Reference({ required: true })
    quiz = Field.Reference({ required: true })
    score = Field.Number()
    startTime = Field.DateTime({ required: true })
    endTime = Field.DateTime({ required: true })
    created = Field.DateTime({ required: true, auto: true })
    modified = Field.DateTime({ required: true, auto: true })
    deleted = Field.DateTime()
}

export default UserQuiz
