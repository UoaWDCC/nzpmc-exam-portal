import { Model, Field } from 'fireo'

class userQuiz extends Model {
    super() {
        this.user = Field.Reference()
        this.quiz = Field.Reference()
        this.answers = Field.Array()
        this.score = Field.Number()
        this.startTime = Field.Timestamp()
        this.endTime = Field.Timestamp()
        this.createdAt = Field.Timestamp()
        this.modifiedAt = Field.Timestamp()
        this.deleted = Field.Timestamp()
    }
}

export default userQuiz
