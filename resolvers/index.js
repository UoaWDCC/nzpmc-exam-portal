import { merge } from 'lodash'
import userResolver from './users'
import userQuizResolver from './userQuizzes'
import quizResolver from './quizzes'
import questionResolver from './questions'
import optionResolver from './options'
import timeResolver from './time'
import datetimeScalar from '../scalars/datetime'

const rootResolver = {}

const customScalars = {
    DateTime: datetimeScalar,
}
export default merge(
    customScalars,
    rootResolver,
    userResolver,
    questionResolver,
    quizResolver,
    userQuizResolver,
    optionResolver,
    timeResolver
)
