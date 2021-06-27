import { merge } from 'lodash'
import userResolver from './user'
import questionResolver from './question'
import quizResolver from './quizzes'
import timeResolver from './time'

const rootResolver = {}

export default merge(rootResolver, userResolver, questionResolver, quizResolver, timeResolver)
