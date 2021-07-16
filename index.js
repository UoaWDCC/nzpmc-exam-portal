import './utils/dotenv'
import { ApolloServer } from 'apollo-server-express'
import { readdirSync, readFileSync } from 'fs'
import express from 'express'
import cors from 'cors'
import resolvers from './resolvers'
import { auth } from './utils/firebase'

const schemaFiles = readdirSync('./schemas/').filter((file) =>
    file.endsWith('.graphql'),
)
const typeDefs = schemaFiles.map((path) => {
    return readFileSync('./schemas/' + path).toString('utf-8')
})

const app = express()

app.use(cors())

const server = new ApolloServer({
    resolvers,
    typeDefs,
    introspection: true,
    playground: true,
    debug: true,
    context: auth(),
})

server.applyMiddleware({
    app,
})

const port = process.env.PORT | 8080
app.listen(port, () => {
    console.log(`Server is ready at http://localhost:${port}`)
    console.log(
        `GraphQL Server is ready at http://localhost:${port}${server.graphqlPath}`,
    )
})
