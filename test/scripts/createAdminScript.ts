import admin from 'firebase-admin'
import dotenv from 'dotenv'
dotenv.config({ path: '../../env' })

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
}

const args = process.argv.slice(2)

console.log('Create Admin Script:', args)

addAdminClaim(args[0])
