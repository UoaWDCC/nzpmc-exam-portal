import { merge } from 'lodash'
import { GraphQLUpload } from 'graphql-upload'
import userResolver from './users'
import userQuizResolver from './userQuizzes'
import quizResolver from './quizzes'
import questionResolver from './questions'
import optionResolver from './options'
import timeResolver from './time'
import imageResolver from './image'
import datetimeScalar from '../scalars/datetime'
import { GraphQLScalarType } from 'graphql/type'
import { Resolvers } from './resolvers-types'

const rootResolver: Resolvers = {}

interface Scalars {
    DateTime: GraphQLScalarType
    Upload: GraphQLScalarType
}

const customScalars: Scalars = {
    DateTime: datetimeScalar,
    Upload: GraphQLUpload,
}

const resolver: Resolvers = merge(
    customScalars,
    rootResolver,
    userResolver,
    questionResolver,
    quizResolver,
    userQuizResolver,
    optionResolver,
    timeResolver,
    imageResolver,
)

export default resolver
