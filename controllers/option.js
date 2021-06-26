import { Option } from '../models'

const packOption = (option) => {
    return {
        key: option.key,
        id: option.id,
        option: option.option,
        created: option.created,
        modified: option.modified,
        deleted: option.deleted,
    }
}

const packOptions = (option) => option.map(packOption)

const getQuestionOptions = async (id) => {
    const option = (await Option.collection.parent(id).fetch()).list
    return packOptions(option)
}

export { getQuestionOptions }
