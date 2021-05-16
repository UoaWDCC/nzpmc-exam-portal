import { merge } from 'lodash'
import userResolver from './user'

const rootResolver = {}

export default merge(rootResolver, userResolver)
