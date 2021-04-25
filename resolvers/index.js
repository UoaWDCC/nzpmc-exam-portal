import exampleResolvers from './example'
import { merge } from 'lodash'

const rootResolver = {}

export default merge(rootResolver, exampleResolvers)
