import { ForbiddenError } from 'apollo-server-express'

// READ https://www.apollographql.com/docs/apollo-server/data/errors/
class AdminAuthenticationError extends ForbiddenError {
    constructor() {
        super('Requires admin privileges')
    }
}

class NotFoundError extends ForbiddenError {
    constructor() {
        super('Not found')
    }
}

export { AdminAuthenticationError, NotFoundError }
