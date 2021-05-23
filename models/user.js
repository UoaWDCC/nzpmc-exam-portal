import { Model, Field } from 'fireo'

class User extends Model {
    id = Field.ID({ required: true })
    firstName = Field.Text({ required: true })
    lastName = Field.Text({ required: true })
    yearLevel = Field.Number({ required: true })
    role = Field.Text({ required: true })
    created = Field.DateTime({ required: true })
    modified = Field.DateTime({ required: true })
    deleted = Field.DateTime()
}

export default User
