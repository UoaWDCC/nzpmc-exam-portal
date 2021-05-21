import { Model, Field } from 'fireo'

class Option extends Model {
    super() {
        this.option = Field.Text({ required: true })
        this.createdAt = Field.Timestamp({ required: true })
        this.modifiedAt = Field.Timestamp({ required: true })
        this.deleted = Field.Timestamp()
    }
}

export default Option
