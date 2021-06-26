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

const getUserQuizQuestionOptionID = async (userQuiz, optionID) => {
    const option = await Option.collection
        .parent(userQuiz.key)
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

const addQuestionAnswer = async (question, o) => {
    const option = Option.init()

    option.id = question.id
    option.option = o
    option.created = new Date()
    option.modified = new Date()

    await option.save()

    const q = await Question.collection.get({ key: question.key })
    q.answer = option.key
    q.created = q.created.toDate()
    q.modified = new Date()
    await q.update()

    return await getOptionKey(option.key)
}

const editQuestionAnswer = async (question, o) => {
    const option = await Option.collection.get({ id: question.id })

    option.option = o
    option.created = option.created.toDate()
    option.modified = new Date()

    await option.update()

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
    getUserQuizQuestionOptionID,
    addQuestionOption,
    editQuestionOption,
    addQuestionAnswer,
    editQuestionAnswer,
}
