import * as firebaseAdmin from 'firebase-admin'
const admin = firebaseAdmin.initializeApp({
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
    }
}

const firestore = admin.firestore()

export { firestore, admin, auth }
