import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import datetimeScalar from '../scalars/datetime'
import { Resolvers } from './resolvers-types'
import mutationResolvers from './mutationResolvers'
import queryResolvers from './queryResolvers'
import questionResolvers from './questionResolvers'
import quizResolvers from './quizResolvers'
import userQuizResolvers from './userQuizResolvers'
import userQuizQuestionResolvers from './userQuizQuestionResolvers'

const resolver: Resolvers = {
    // Custom Scalars
    DateTime: datetimeScalar,
    Upload: GraphQLUpload,

    // Mutation
    Mutation: mutationResolvers,

    // Query
    Query: queryResolvers,

    // Custom Resolver
    Question: questionResolvers,
    Quiz: quizResolvers,
    UserQuiz: userQuizResolvers,
    UserQuizQuestion: userQuizQuestionResolvers,
}

export default resolver
