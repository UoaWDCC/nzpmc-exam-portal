import { Model, Field } from 'fireo'

class userQuizAnswer extends Model {
    super() {
        this.question = Field.Reference({ required: true })
        this.answer = Field.Reference({ required: true })
        this.firstViewed = Field.Timestamp({ required: true })
        this.lastAnswered = Field.Timestamp({ required: true })
        this.createdAt = Field.Timestamp({ required: true })
        this.modifiedAt = Field.Timestamp({ required: true })
        this.deleted = Field.Timestamp()
    }
}

export default userQuizAnswer
