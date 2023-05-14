import dotenv from 'dotenv'
dotenv.config()

import admin from 'firebase-admin'
import { getRepository, initialize } from "fireorm";
import { User } from "../../src/models";

admin.initializeApp();
const firestore = admin.firestore()
initialize(firestore)

const addUserDocument = async (uid: string) => {
    const user = new User();
    const UserRepository = getRepository(User)

    user.id = uid
    user.displayName = "John Chen"
    user.email = "jche428@aucklanduni.ac.nz"
    user.photoURL = "temp"
    user.firstName = "John"
    user.lastName = "Chen"
    user.yearLevel = "13"
    user.role = "admin"

    await UserRepository.create(user);
}

const args = process.argv.slice(2)

if (args.length == 0)
{
    console.log('Adding User with user ID:', process.env.USER_ID)
    addUserDocument(process.env.USER_ID!)
} else {
    console.log('Adding User with user ID:', args[0])
    addUserDocument(args[0])
}
