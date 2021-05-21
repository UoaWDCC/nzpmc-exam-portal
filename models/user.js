import { Model, Field } from 'fireo'

class User extends Model {
    super() {
        this.firstName = Field.Text({ required: true })
        this.lastName = Field.Text({ required: true })
        this.yearLevel = Field.Number({ required: true })
        this.role = Field.Text({ required: true })
        this.created = Field.Timestamp({ required: true })
        this.modified = Field.Timestamp({ required: true })
        this.deleted = Field.Timestamp()
    }
}

export default User
