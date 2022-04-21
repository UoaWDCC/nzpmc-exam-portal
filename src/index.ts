import './utils/dotenv'
import { ApolloServer } from 'apollo-server-express'
import { PluginDefinition } from 'apollo-server-core'
import { readdirSync, readFileSync } from 'fs'
import { graphqlUploadExpress } from 'graphql-upload'
import express from 'express'
import cors from 'cors'
import resolvers from './resolvers'
import { auth } from './utils/firebase'
import { imageController } from './utils/cloudstorage'

const schemaFiles = readdirSync('./src/schemas/').filter((file: string) =>
    file.endsWith('.graphql'),
)
const typeDefs = schemaFiles.map((path: string) => {
    return readFileSync('./src/schemas/' + path).toString('utf-8')
})

const port = process.env.PORT || 8080

const startApolloServer = async (): Promise<void> => {
    const server = new ApolloServer({
        resolvers,
        typeDefs,
        introspection: true,
        debug: true,
        context: auth,
    })

    await server.start()

    const app = express()

    app.use(cors())

    app.use(graphqlUploadExpress())

    app.get('/images/:questionID/:filename', imageController)

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
}

startApolloServer()
