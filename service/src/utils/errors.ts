import {
    ForbiddenError,
    AuthenticationError as AuthError,
    ApolloError,
} from 'apollo-server-express'

// READ https://www.apollographql.com/docs/apollo-server/data/errors/
class AdminAuthenticationError extends ForbiddenError {
    constructor() {
        super('Requires admin privileges')
    }
}

class AuthenticationError extends AuthError {
    constructor() {
        super('Requires authentication')
    }
}

class NotFoundError extends ForbiddenError {
    constructor() {
        super('Not found')
    }
}

class ExpiredError extends ApolloError {
    constructor(message: string) {
        super(message, 'EXPIRED')

        Object.defineProperty(this, 'name', { value: 'ExpiredError' })
    }
}

class UserQuizExpiredError extends ExpiredError {
    constructor() {
        super('User quiz has expired')
    }
}

export {
    AdminAuthenticationError,
    NotFoundError,
    AuthenticationError,
    UserQuizExpiredError,
}
