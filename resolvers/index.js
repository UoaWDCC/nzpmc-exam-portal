import { merge } from 'lodash'
import userResolver from './user'
import questionResolver from './question'
import quizResolver from './quizzes'

const rootResolver = {}

export default merge(rootResolver, userResolver, questionResolver, quizResolver)
