import admin, { auth } from 'firebase-admin'
import * as fireorm from 'fireorm'
import axios from 'axios'
import { ExpressContext } from 'apollo-server-express'
import {
    isAdminInFirestore,
    addAdminClaim,
    removeAdminClaim,
    generateNewToken,
} from './auth'

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.BUCKET,
})

export interface UserContext {
    user?: auth.DecodedIdToken
}

const authCheck = async ({ req }: ExpressContext): Promise<UserContext> => {
    const token = req.headers.authorization
        ? req.headers.authorization.replace('Bearer ', '')
        : null

    if (!token) return {}

    try {
        let decodedIdToken = await admin.auth().verifyIdToken(token)
        const uid = decodedIdToken.uid
        const user = await admin.auth().getUser(uid)
        const hasAdminClaim = user.customClaims?.admin
        const isAdmin = await isAdminInFirestore(uid)

        // hasAdminClaim XOR isAdmin - only create new tokens if claims don't match up
        if ((hasAdminClaim && !isAdmin) || (!hasAdminClaim && isAdmin)) {
            if (isAdmin) {
                await addAdminClaim(uid)
            } else {
                await removeAdminClaim(uid)
            }

            const newToken = await generateNewToken(uid)

            decodedIdToken = await admin.auth().verifyIdToken(newToken)
        }

        return {
            user: decodedIdToken,
        }
    } catch (e) {
        // Invalid token
        console.log(e)
        return {}
    }
}

const addFirebaseUser = async (
    displayName: string,
    firstName: string,
    lastName: string,
    photoURL: string,
    email: string,
    password: string,
): Promise<auth.UserRecord> => {
    // Check DisplayName
    let profileImgName: string
    if (!displayName) {
        displayName = `${firstName} ${lastName}`
        profileImgName = `${firstName}+${lastName}`
    } else {
        profileImgName = displayName
    }
    //replace all spaces
    profileImgName = profileImgName.replace(/ /g, '+')

    if (!photoURL || photoURL.trim() === '') {
        // Generate random dark color for profile background
        let randomDarkColor = ''
        for (let i = 0; i < 6; i++) {
            randomDarkColor += Math.floor(Math.random() * 10)
        }

        photoURL = `https://ui-avatars.com/api/?background=${randomDarkColor}&color=ffffff&name=${profileImgName}`
    }
    console.log(photoURL)

    // Generate random password for user if password is not set
    if (!password) {
        const min = 8,
            max = 12
        const passwordLength = Math.floor(Math.random() * (max - min + 1) + min)

        const chars =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%'
        let pass = ''
        for (let i = 0; i < passwordLength; i++) {
            const pos = Math.floor(Math.random() * chars.length)
            pass += chars.substring(pos, pos + 1)
        }

        password = pass
    }

    console.log(photoURL)
    const userRecord = await admin.auth().createUser({
        email,
        emailVerified: false,
        password,
        displayName,
        photoURL,
        disabled: false,
    })

    return userRecord
}

/**
 * Basically firebase-admin doesn't support sendEmail, only allows sending in client
 *
 * HotFix: https://github.com/firebase/firebase-admin-node/issues/46#issuecomment-625026299
 */
const resetUserPasswordEmail = (email: string): Promise<void> => {
    const apikey = process.env.PROJECT_API_KEY
    const sendEmailVerificationEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apikey}`

    return axios.post(sendEmailVerificationEndpoint, {
        requestType: 'PASSWORD_RESET',
        email,
    })
}

const firestore = admin.firestore()

fireorm.initialize(firestore)

const bucket = admin.storage().bucket()

export {
    firestore,
    admin,
    bucket,
    authCheck as auth,
    addAdminClaim,
    addFirebaseUser,
    resetUserPasswordEmail,
}
