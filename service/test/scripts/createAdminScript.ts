import admin from 'firebase-admin'
import dotenv from 'dotenv'
dotenv.config()

/**
 * How to use:
 * ```
 * ts-node ./test/scripts/createAdminScript <USER_UID>
 *
 * ts-node ./test/scripts/createAdminScript mdLy2GYwTMZovNtnkj121dWU2YP2
 * ```
 */

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
})

// Only applies after refreshing the token
const addAdminClaim = async (uid) => {
    admin.auth().setCustomUserClaims(uid, { admin: true })
    console.log("Claim added.")
}

const args = process.argv.slice(2)

if (args.length == 0)
{
    console.log('Adding admin claim for User ID:', process.env.USER_ID)
    addAdminClaim(process.env.USER_ID)
} else {
    console.log('Adding admin claim for User ID:', args[0])
    addAdminClaim(args[0])
}
