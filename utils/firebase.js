import admin from 'firebase-admin'
import axios from 'axios'

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
})

const auth =
    () =>
    async ({ req }) => {
        const token = req.headers.authorization
            ? req.headers.authorization.replace('Bearer ', '')
            : null

        if (!token) return

        try {
            return {
                user: await admin.auth().verifyIdToken(token),
            }
        } catch (e) {
            // Invalid token
            console.log(e)
        }
    }

// Only applies after refreshing the token
const addAdminClaim = async (uid) => {
    admin.auth().setCustomUserClaims(uid, { admin: true })
}

const addFirebaseUser = async (
    displayName,
    firstName,
    lastName,
    photoURL,
    email,
    password,
) => {
    // Check DisplayName
    let profileImgName
    if (!displayName) {
        displayName = `${firstName} ${lastName}`
        profileImgName = `${firstName}+${lastName}`
    } else {
        profileImgName = displayName
    }

    if (!photoURL) {
        // Generate random dark color for profile background
        let randomDarkColor = '#'
        for (let i = 0; i < 6; i++) {
            randomDarkColor += Math.floor(Math.random() * 10)
        }

        photoURL = `https://ui-avatars.com/api/?background=${randomDarkColor}&color=ffffff&name=${profileImgName}`
    }

    // Generate random password for user if password is not set
    if (!password) {
        const min = 8,
            max = 12
        const passwordLength = Math.floor(Math.random() * (max - min + 1) + min)

        const chars =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%'
        let pass = ''
        for (let i = 0; i < passwordLength; i++) {
            let pos = Math.floor(Math.random() * chars.length)
            pass += chars.substring(pos, pos + 1)
        }

        password = pass
    }

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            emailVerified: false,
            password: password,
            displayName: displayName,
            photoURL: photoURL,
            disabled: false,
        })

        return userRecord
    } catch (err) {
        throw err
    }
}

/**
 * Basically firebase-admin doesn't support sendEmail, only allows sending in client
 *
 * HotFix: https://github.com/firebase/firebase-admin-node/issues/46#issuecomment-625026299
 */
const resetUserPasswordEmail = async (email) => {
    const apikey = process.env.PROJECT_API_KEY
    const sendEmailVerificationEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apikey}`

    try {
        const response = await axios.post(sendEmailVerificationEndpoint, {
            requestType: 'PASSWORD_RESET',
            email: email,
        })
    } catch (err) {
        throw err
    }
}

const firestore = admin.firestore()

export {
    firestore,
    admin,
    auth,
    addAdminClaim,
    addFirebaseUser,
    resetUserPasswordEmail,
}
