const { GraphQLScalarType, Kind } = require('graphql')

const datetimeScalar = new GraphQLScalarType({
    name: 'DateTime',
    description: 'DateTime custom scalar type',
    serialize(value) {
        if (value instanceof Date) {
            return value.toISOString()
        } else {
            // Assume it's a Timestamp
            // See: https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
            return value.toDate().toISOString()
        }
    },
    parseValue(value) {
        return new Date(value) // Convert incoming integer to Date
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value)
        }
        return null // Invalid hard-coded value (not an integer)
    },
})

export default datetimeScalar
