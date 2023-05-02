import { getOptionByID, getQuestionOptions } from '../controllers'
import { QuestionModel } from './custom/questionModel'
import {
    Maybe,
    Option,
    QuestionResolvers,
    Resolver,
    ResolverTypeWrapper,
} from '@nzpmc-exam-portal/common/resolvers-types'

const answerQuestion: Resolver<
    Maybe<ResolverTypeWrapper<Option>>,
    QuestionModel,
    unknown,
    unknown
> = async (parents, _args, _context) => {
    const { quizID, id: questionID, answerID } = parents

    return await getOptionByID(quizID, questionID, answerID)
}

const optionsQuestion: Resolver<
    Maybe<Maybe<ResolverTypeWrapper<Option>>[]>,
    QuestionModel,
    unknown,
    unknown
> = async (parents, _args, _context) => {
    const { quizID, id } = parents
    return await getQuestionOptions(quizID, id)
}

const questionResolvers: QuestionResolvers = {
    answer: answerQuestion,
    options: optionsQuestion,
}

export default questionResolvers
