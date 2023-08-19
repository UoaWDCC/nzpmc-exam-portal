import dotenv from 'dotenv'
dotenv.config()

import admin from 'firebase-admin'
import { getRepository, initialize } from 'fireorm'
import { User } from '../../src/models'

admin.initializeApp()
const firestore = admin.firestore()
initialize(firestore)

const addUserDocument = async (uid: string) => {
    const user = new User()
    const UserRepository = getRepository(User)

    await UserRepository.delete(uid)

    user.id = uid
    user.displayName = 'Test User'
    user.email = 'test.user@gmail.com' //should match email used for auth in Firebase
    user.photoURL = 'placeholder.png'
    user.firstName = 'Test'
    user.lastName = 'User'
    user.yearLevel = '13'
    user.role = 'admin'

    await UserRepository.create(user)
}

const args = process.argv.slice(2)

if (args.length === 0) {
    console.log('Adding User with user ID:', process.env.USER_ID)
    addUserDocument(process.env.USER_ID!)
} else {
    console.log('Adding User with user ID:', args[0])
    addUserDocument(args[0])
}
