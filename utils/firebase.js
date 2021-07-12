import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
})

const auth = () => async ({ req }) => {
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

const firestore = admin.firestore()

export { firestore, admin, auth, addAdminClaim }
