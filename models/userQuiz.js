import { Model, Field } from 'fireo'

class userQuiz extends Model {
    super() {
        this.user = Field.Reference({ required: true })
        this.quiz = Field.Reference({ required: true })
        this.answers = Field.Array({ required: true })
        this.score = Field.Number({ required: true })
        this.startTime = Field.Timestamp({ required: true })
        this.endTime = Field.Timestamp({ required: true })
        this.createdAt = Field.Timestamp({ required: true })
        this.modifiedAt = Field.Timestamp({ required: true })
        this.deleted = Field.Timestamp()
    }
}

export default userQuiz
