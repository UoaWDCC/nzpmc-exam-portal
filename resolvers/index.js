import { merge } from 'lodash'
import userResolver from './user'
import questionResolver from './question'

const rootResolver = {}

export default merge(rootResolver, userResolver, questionResolver)
