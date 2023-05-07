import { GraphQLScalarType, Kind } from 'graphql'
import { Timestamp } from '@google-cloud/firestore'

const datetimeScalar = new GraphQLScalarType<Date, string>({
    name: 'DateTime',
    description: 'DateTime custom scalar type',
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString()
        }
        if (value instanceof Timestamp) {
            // Assume it's a Timestamp
            // See: https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
            return value.toDate().toISOString()
        }

        throw new Error(`Unknown scalar type: ${value}`)
    },
    parseValue(value) {
        if (typeof value === 'string') {
            return new Date(value) // Convert incoming integer to Date
        }

        throw new Error(`Unknown scalar type: ${value}`)
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value)
        }
        throw new Error(`Unknown scalar type: ${ast}`)
    },
})

export default datetimeScalar
