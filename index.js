import { ApolloServer } from 'apollo-server'
import { readdirSync, readFileSync } from 'fs'
import resolvers from './resolvers'

const schemaFiles = readdirSync('./schemas/').filter((file) =>
    file.endsWith('.graphql'),
)
const typeDefs = schemaFiles.map((path) => {
    return readFileSync('./schemas/' + path).toString('utf-8')
})

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
