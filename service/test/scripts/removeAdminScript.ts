import admin from 'firebase-admin'
import dotenv from 'dotenv'
dotenv.config()

/**
 * How to use:
 * ```
 * ts-node ./test/scripts/removeAdminScript <USER_UID>
 *
 * ts-node ./test/scripts/removeAdminScript mdLy2GYwTMZovNtnkj121dWU2YP2
 * ```
 */

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
})

// Only applies after refreshing the token
const removeAdminClaim = async (uid) => {
    admin.auth().setCustomUserClaims(uid, { admin: false })
    console.log("Claim removed.")
}

const args = process.argv.slice(2)

if (args.length == 0)
{
    console.log('Removing admin claim for User ID:', process.env.USER_ID)
    removeAdminClaim(process.env.USER_ID)
} else {
    console.log('Removing admin claim for User ID:', args[0])
    removeAdminClaim(args[0])
}
