import { Model, Field } from 'fireo'

class User extends Model {
    super() {
        this.firstName = Field.Text()
        this.lastName = Field.Text()
        this.yearLevel = Field.Number()
        this.role = Field.Text()
        this.created = Field.Timestamp()
        this.modified = Field.Timestamp()
        this.deleted = Field.Timestamp()
    }
}

export default User
