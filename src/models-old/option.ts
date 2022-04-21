import { Model, Field } from 'fireo'

class Option extends Model {
    id = Field.ID()
    option = Field.Text({ required: true })
    created = Field.DateTime({ required: true, auto: true })
    modified = Field.DateTime({ required: true, auto: true })
    deleted = Field.DateTime()
}

export default Option
