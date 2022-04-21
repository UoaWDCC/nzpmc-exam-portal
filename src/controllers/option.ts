import { getRepository } from 'fireorm'
import { packOption, packOptions } from '../mappers/optionMapper'
import { Option, Question } from '../models'

const OptionRepository = getRepository(Option)

const getQuestionOptions = async (question) => {
    const option = (await Option.collection.parent(question.key).fetch()).list
    return packOptions(option)
}

const getOptionKey = async (optionKey) => {
    const option = await Option.collection.get({ key: optionKey })
    return packOption(option)
}

const getOptionByQuestionID = async (question, optionID) => {
    let option
    if (!question.answerObj || !question.answerObj.ref) {
        option = await Option.collection.get({
            key: question.key + '/Option/' + optionID,
        })
    } else {
        const answer = await question.answerObj.get()
        if (answer.id == optionID) {
            option = answer
        } else {
            option = await Option.collection.get({
                key: question.key + '/Option/' + optionID,
            })
        }
    }

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
    const option = await Option.collection.get({
        key: question.key + '/Option/' + id,
    })

    option.option = o
    option.created = option.created.toDate()
    option.modified = new Date()

    await option.update()

    return packOption(option)
}

const insertQuestionAnswer = async (question, o) => {
    let option, created
    if (!question.answer || !question.answer.ref) {
        option = Option.init()
        created = new Date()
    } else {
        option = await Option.collection.get({ id: question.answer.id })
        created = option.created.toDate()
    }

    option.option = o
    option.created = created
    option.modified = new Date()

    await option.save()

    // update question with answer
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
    getOptionByQuestionID,
    addQuestionOption,
    editQuestionOption,
    insertQuestionAnswer,
}
