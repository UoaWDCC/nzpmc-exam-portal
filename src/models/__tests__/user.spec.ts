import { getRepository } from 'fireorm'
import User from '../user'
import '../../../test/fireorm'

describe('User', () => {
    const UserRepository = getRepository(User)
    it('can be created', async () => {
        const user = new User()
        user.displayName = 'Example'
        user.email = 'example@email.co.nz'
        user.photoURL = process.env.BACKEND_URL + '/images/test.png'
        user.firstName = 'Example'
        user.lastName = 'User'
        user.yearLevel = 'Year Level'
        user.role = 'Student'

        const userDocument = await UserRepository.create(user)
        const readUserDocument = await UserRepository.findById(userDocument.id)

        expect(readUserDocument.displayName).toEqual(user.displayName)
        expect(readUserDocument.email).toEqual(user.email)
    })

    it('can be updated', async () => {
        const user = new User()
        user.displayName = 'Example'
        user.email = 'example@email.co.nz'
        user.photoURL = process.env.BACKEND_URL + '/images/test.png'
        user.firstName = 'Example'
        user.lastName = 'User'
        user.yearLevel = 'Year Level'
        user.role = 'Student'

        const userDocument = await UserRepository.create(user)

        userDocument.displayName = 'updated'

        await UserRepository.update(userDocument)

        const readUserDocument = await UserRepository.findById(userDocument.id)

        expect(readUserDocument.displayName).toEqual(userDocument.displayName)
    })
})
