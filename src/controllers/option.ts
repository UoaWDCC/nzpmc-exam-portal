import { getRepository } from 'fireorm'
import { packOption, packOptions } from '../mappers/optionMapper'
import { Option, Quiz } from '../models'
import { NotFoundError } from '../utils/errors'
import * as Schema from '../resolvers/resolvers-types'

const QuizRepository = getRepository(Quiz)

const getQuestionOptions = async (
    quizID: string,
    questionID: string,
): Promise<Schema.Option[]> => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(questionID)
        if (!question || !question.options) {
            throw new NotFoundError()
        }

        const options = await question.options.find()
        return packOptions(options)
    })
}

const getOptionByID = async (
    quizID: string,
    questionID: string,
    optionID: string,
): Promise<Schema.Option> => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(questionID)
        if (!question || !question.options) {
            throw new NotFoundError()
        }

        const option = await question.options.findById(optionID)
        if (!option) {
            throw new NotFoundError()
        }

        return packOption(option)
    })
}

const addQuestionOption = async (
    quizID: string,
    questionID: string,
    o: string,
) => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(questionID)
        if (!question || !question.options) {
            throw new NotFoundError()
        }

        const option = new Option()
        option.option = o

        const newOption = await question.options.create(option)

        return packOption(newOption)
    })
}

const editQuestionOption = async (
    quizID: string,
    questionID: string,
    optionID: string,
    o: string,
) => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(questionID)
        if (!question || !question.options) {
            throw new NotFoundError()
        }

        const option = await question.options.findById(optionID)
        if (!option) {
            throw new NotFoundError()
        }

        option.option = o

        const newOption = await question.options.create(option)

        return packOption(newOption)
    })
}

export {
    getQuestionOptions,
    getOptionByID,
    addQuestionOption,
    editQuestionOption,
}
