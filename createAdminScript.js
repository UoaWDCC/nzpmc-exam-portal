import admin from 'firebase-admin'
import dotenv from 'dotenv'
dotenv.config()

/**
 * How to use:
 * ```
 * node -r esm createAdminScript <USER_UID>
 * ```
 */

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
})

// Only applies after refreshing the token
const addAdminClaim = async (uid) => {
    admin.auth().setCustomUserClaims(uid, { admin: true })
}

let args = process.argv.slice(2)

console.log('Create Admin Script:', args)

addAdminClaim(args[0])
