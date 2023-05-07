import admin from 'firebase-admin'
import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()

/**
 * How to use:
 * ```
 * ts-node ./test/scripts/loginScript <USER_UID>
 *
 * ts-node ./test/scripts/loginScript mdLy2GYwTMZovNtnkj121dWU2YP2
 * ```
 */

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
})

const createIdToken = async (uid) => {
    try {
        const customToken = await admin.auth().createCustomToken(uid)

        const res = await axios.post(
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.FIREBASE_API_KEY}`,
            {
                token: customToken,
                returnSecureToken: true,
            },
        )

        console.log("\nAuthorization Header:")
        console.log("Bearer " + res.data.idToken)

        return res.data.idToken
    } catch (e) {
        console.log(e)
    }
}

const args = process.argv.slice(2)

if (args.length == 0)
{
    console.log('Login with User ID:', process.env.USER_ID)
    createIdToken(process.env.USER_ID)
} else {
    console.log('Login with User ID:', args[0])
    createIdToken(args[0])
}

