import { merge } from 'lodash'
import { GraphQLUpload, processRequest } from 'graphql-upload';
import userResolver from './users'
import userQuizResolver from './userQuizzes'
import quizResolver from './quizzes'
import questionResolver from './questions'
import optionResolver from './options'
import timeResolver from './time'
import imageResolver from './image'
import datetimeScalar from '../scalars/datetime'

const rootResolver = {}

const customScalars = {
    DateTime: datetimeScalar,
    Upload: GraphQLUpload,
}
export default merge(
    customScalars,
    rootResolver,
    userResolver,
    questionResolver,
    quizResolver,
    userQuizResolver,
    optionResolver,
    timeResolver,
    imageResolver
)
