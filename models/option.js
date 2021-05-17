import { Model, Field } from 'fireo'

class Option extends Model {
    super() {
        this.option = Field.Text()
        this.createdAt = Field.Timestamp()
        this.modifiedAt = Field.Timestamp()
        this.deleted = Field.Timestamp()
    }
}

export default Option
