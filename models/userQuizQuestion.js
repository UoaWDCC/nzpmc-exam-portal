import { Model, Field } from 'fireo'

class UserQuizQuestion extends Model {
    id = Field.ID()
    question = Field.Reference({ required: true })
    answer = Field.Reference({ required: true })
    firstViewed = Field.DateTime({ required: true })
    lastAnswered = Field.DateTime({ required: true })
    created = Field.DateTime({ required: true, auto: true })
    modified = Field.DateTime({ required: true, auto: true })
    deleted = Field.DateTime()
}

export default UserQuizQuestion
