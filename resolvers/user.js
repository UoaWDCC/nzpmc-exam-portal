const studUser = {
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

const resolvers = {
    Query: {
        user(parents, args, ctx) {
            return studUser
        },
        me(parents, args, ctx) {
            return studUser
        },
        users(parents, args, ctx) {
            return [studUser, studUser, studUser, studUser]
        } 
    },
}

export default resolvers
