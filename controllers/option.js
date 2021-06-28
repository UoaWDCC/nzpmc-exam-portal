import { Option, Question } from '../models'

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

const getQuestionOptions = async (question) => {
    const option = (await Option.collection.parent(question.key).fetch()).list
    return packOptions(option)
}

const getOptionKey = async (optionKey) => {
    const option = await Option.collection.get({ key: optionKey })
    return packOption(option)
}

const getOptionByQuestionID = async (question, optionID) => {
    const option = await Option.collection
        .parent(question.key)
        .get({ id: optionID })
    return packOption(option)
}

const addQuestionOption = async (question, o) => {
    const option = Option.init({ parent: question.key })

    option.option = o
    option.created = new Date()
    option.modified = new Date()

    await option.save()

    return await getOptionKey(option.key)
}

const editQuestionOption = async (question, id, o) => {
    const option = await Option.collection.parent(question.key).get({ id })

    option.option = o
    option.created = option.created.toDate()
    option.modified = new Date()

    await option.update()

    return packOption(option)
}

const upsertQuestionAnswer = async (question, o) => {
    let option, created
    if (!question.answer || !question.answer.ref) {
        option = Option.init()
        created = new Date()
        option.id = question.id
    } else {
        option = await Option.collection.get({ id: question.id })
        created = option.created.toDate()
    }

    option.option = o
    option.created = created
    option.modified = new Date()

    await option.upsert()

    const q = await Question.collection.get({ key: question.key })
    q.answer = option.key
    q.created = q.created.toDate()
    q.modified = new Date()
    await q.update()

    return packOption(option)
}

export {
    getQuestionOptions,
    getOptionKey,
    packOptions,
    getOptionByQuestionID,
    addQuestionOption,
    editQuestionOption,
    upsertQuestionAnswer,
}
