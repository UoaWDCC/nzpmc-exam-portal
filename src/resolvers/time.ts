import { AuthenticationError } from '../utils/errors'

const resolvers = {
    Query: {
        currentTime: (parents, arg, ctx) => {
            if (!ctx.user) throw new AuthenticationError()

            return new Date()
        },
    },
}

export default resolvers
