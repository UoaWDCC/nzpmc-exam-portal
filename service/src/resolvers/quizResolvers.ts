import { getQuestion, getQuestions } from '../controllers'
import { admin } from './helpers/auth'
import {
    QuestionModel,
    Maybe,
    Quiz,
    QuizQuestionArgs,
    QuizResolvers,
    RequireFields,
    Resolver,
    ResolverTypeWrapper,
} from '@nzpmc-exam-portal/common'

const questionQuiz: Resolver<
    Maybe<ResolverTypeWrapper<QuestionModel>>,
    Quiz,
    unknown,
    RequireFields<QuizQuestionArgs, 'id'>
> = (parents, args, _context) => {
    const { id: quizID } = parents
    const { id: questionID } = args
    return getQuestion(quizID, questionID)
}

const questionsQuiz: Resolver<
    Maybe<Maybe<ResolverTypeWrapper<QuestionModel>>[]>,
    Quiz,
    unknown,
    unknown
> = (parents, _args, _context) => {
    const { id: quizID } = parents
    return getQuestions(quizID)
}

const quizResolvers: QuizResolvers = {
    question: admin(questionQuiz),
    questions: admin(questionsQuiz),
}

export default quizResolvers
