import {
    getUserQuizQuestionAnswer,
    getUserQuizQuestionOptions,
} from '../controllers'
import { user } from './helpers/auth'
import {
    UserQuizQuestionModel,
    Maybe,
    Option,
    Resolver,
    ResolverTypeWrapper,
    UserQuizQuestionResolvers,
} from '@nzpmc-exam-portal/common'

const userAnswerUserQuizQuestion: Resolver<
    Maybe<ResolverTypeWrapper<Option>>,
    UserQuizQuestionModel,
    unknown,
    unknown
> = (parents, _args, _context) => {
    const { userQuizID, id: userQuizQuestionID } = parents
    return getUserQuizQuestionAnswer(userQuizID, userQuizQuestionID)
}

const optionsUserQuizQuestion: Resolver<
    ResolverTypeWrapper<Option>[],
    UserQuizQuestionModel,
    unknown,
    unknown
> = (parents, _args, _context) => {
    const { userQuizID, id: userQuizQuestionID } = parents
    return getUserQuizQuestionOptions(userQuizID, userQuizQuestionID)
}

const userQuizQuestionResolvers: UserQuizQuestionResolvers = {
    userAnswer: user(userAnswerUserQuizQuestion),
    options: user(optionsUserQuizQuestion),
}

export default userQuizQuestionResolvers
