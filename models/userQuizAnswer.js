import { Model, Field } from 'fireo'

class userQuizAnswer extends Model {
    super() {
        this.question = Field.Reference()
        this.answer = Field.Reference()
        this.firstViewed = Field.Timestamp()
        this.lastAnswered = Field.Timestamp()
        this.createdAt = Field.Timestamp()
        this.modifiedAt = Field.Timestamp()
        this.deleted = Field.Timestamp()
    }
}

export default userQuizAnswer
