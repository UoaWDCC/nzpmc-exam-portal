const resolvers = {
    Query: {
        me(parents, args, ctx) {
            return {
                id: '123',
                displayName: 'user',
                email: 'user@email.com',
                emailVerified: 'user@email.com',
                photoURL: 'https://i.imgur.com/G4cy8en.jpg',
                firstName: 'Joe',
                lastName: 'Smith',
                yearLevel: 9,
                role: 'student',
                created: Date.now(),
                modified: Date.now(),
            }
        },
    },
}

export default resolvers
