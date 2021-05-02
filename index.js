import { ApolloServer } from 'apollo-server'
import { readFileSync } from 'fs'
import resolvers from './resolvers'

const queries = readFileSync('./schemas/schema.graphql').toString('utf-8')
// const mutations = readFileSync('./schemas/mutations.graphql').toString('utf-8')
const objects = readFileSync('./schemas/objects.graphql').toString('utf-8')
// const inputs = readFileSync('./schemas/inputs.graphql').toString('utf-8')

const server = new ApolloServer({
    resolvers,
    typeDefs: [queries, objects],
    introspection: true,
    playground: true,
    debug: true,
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})
