import {
    getUserQuizQuestions,
    getUserQuizQuestion,
    getUser,
} from '../controllers'
import { UserQuizModel } from './custom/userQuizModel'
import { UserQuizQuestionModel } from './custom/userQuizQuestionModel'
import {
    Maybe,
    RequireFields,
    Resolver,
    ResolverTypeWrapper,
    User,
    UserQuizQuestionArgs,
    UserQuizResolvers,
} from './resolvers-types'

const userUserQuiz: Resolver<
    Maybe<ResolverTypeWrapper<User>>,
    UserQuizModel,
    unknown,
    unknown
> = (parents, _args, _context) => {
    const { userID } = parents
    return getUser(userID)
}

const questionUserQuiz: Resolver<
    Maybe<ResolverTypeWrapper<UserQuizQuestionModel>>,
    UserQuizModel,
    unknown,
    RequireFields<UserQuizQuestionArgs, 'id'>
> = (parents, args, _context) => {
    const { id: userQuizID } = parents
    const { id: questionID } = args
    return getUserQuizQuestion(userQuizID, questionID)
}

const questionsUserQuiz: Resolver<
    Maybe<Maybe<ResolverTypeWrapper<UserQuizQuestionModel>>[]>,
    UserQuizModel,
    unknown,
    unknown
> = (parents, _args, _context) => {
    const { id: userQuizID } = parents
    return getUserQuizQuestions(userQuizID)
}

const userQuizResolvers: UserQuizResolvers = {
    user: userUserQuiz,
    question: questionUserQuiz,
    questions: questionsUserQuiz,
}

export default userQuizResolvers
