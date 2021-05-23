import { getUser } from '../../controllers/user'

mockFirebase({
    database: {
        User: [
            {
                id: '1',
                displayName: 'example',
                email: 'example@email.com',
                emailVerified: 'example@email.com',
                photoURL: 'https://i.imgur.com/G4cy8en.jpg',
                firstName: 'Example',
                lastName: 'Test',
                yearLevel: 9,
                role: 'student',
                created: Date.now(),
                modified: Date.now(),
            },
            {
                id: '2',
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
            },
        ],
    },
})

test('getUser', async () => {
    console.log(user)

    expect(user).toEqual({})
})
