import { AuthenticationError } from 'apollo-server-express'

const resolvers = {
    Query: {
        currentTime: (parents, arg, ctx) => {
            if (!ctx.user) throw new AuthenticationError()

            return new Date()
        },
    },
}

export default resolvers
