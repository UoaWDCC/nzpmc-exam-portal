import { Option } from '../models'
import { Option as SchemaOption } from '../resolvers/resolvers-types'

const packOption = (option: Option): SchemaOption => {
    return {
        id: option.id,
        option: option.option,
        created: option.created,
        modified: option.modified,
    }
}

const packOptions = (options: Option[]): SchemaOption[] =>
    options.map(packOption)

export { packOption, packOptions }
