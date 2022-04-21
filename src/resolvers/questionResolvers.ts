import { getOptionByID, getQuestionOptions } from '../controllers'
import { QuestionModel } from './custom/questionModel'
import {
    Maybe,
    Option,
    QuestionResolvers,
    Resolver,
    ResolverTypeWrapper,
} from './resolvers-types'

const answerQuestion: Resolver<
    Maybe<ResolverTypeWrapper<Option>>,
    QuestionModel,
    unknown,
    unknown
> = async (parents, _args, _context) => {
    const { quizID, id: questionID, answer } = parents

    return await getOptionByID(quizID, questionID, answer.id)
}

const optionsQuestion: Resolver<
    Maybe<Maybe<ResolverTypeWrapper<Option>>[]>,
    QuestionModel,
    unknown,
    unknown
> = async (parents, _args, _context) => {
    const { id } = parents
    return await getQuestionOptions(id, id)
}

const questionResolvers: QuestionResolvers = {
    answer: answerQuestion,
    options: optionsQuestion,
}

export default questionResolvers
