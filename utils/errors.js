import { ForbiddenError } from 'apollo-server-express'

// READ https://www.apollographql.com/docs/apollo-server/data/errors/
class AdminAuthenticationError extends ForbiddenError {
    constructor() {
        super('Requires admin privileges')
    }
}

export { AdminAuthenticationError }
