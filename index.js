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

const port = process.env.PORT || 8080

const startApolloServer = async () => {
    const server = new ApolloServer({
        resolvers,
        typeDefs,
        introspection: true,
        playground: true,
        debug: true,
        context: auth(),
    })

    await server.start()

    const app = express()

    app.use(cors())

    // Mount Apollo middleware here.
    server.applyMiddleware({
        app,
    })

    app.listen(port, () => {
        console.log(`Server is ready at http://localhost:${port}`)
        console.log(
            `GraphQL Server is ready at http://localhost:${port}${server.graphqlPath}`,
        )
    })

    return { server, app }
}

startApolloServer()
