import { ApolloError } from 'apollo-server'
import { AuthenticationError } from 'apollo-server-core'

// READ https://www.apollographql.com/docs/apollo-server/data/errors/
class AdminAuthenticationError extends AuthenticationError {
    constructor() {
        super('Requires admin privileges')
    }
}
