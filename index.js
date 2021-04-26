import { ApolloServer } from 'apollo-server'
import { readFileSync } from 'fs'
import resolvers from './resolvers'

const typeDefs = readFileSync('./schemas/schema.graphql').toString('utf-8')

const server = new ApolloServer({
    resolvers,
    typeDefs,
    introspection: true,
    playground: true,
    debug: true,
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})
