import * as firebaseAdmin from 'firebase-admin'

const admin = firebaseAdmin.initializeApp({
    credential: admin.credential.applicationDefault(),
})

const db = admin.firestore()

const verifyUserSessionToken = async (token) => {
    const user = await admin.auth().verifySessionCookie(token, true)

    if (user.id) {
        return user
    } else if (user.uid) {
        const { claims } = await getUser(user.uid)
        return claims
    } else {
        throw new Error('User Session Token Verification Error')
    }
}

const setUserClaims = (uid, data) => admin.auth().setCustomUserClaims(uid, data)

const getUser = (uid) => admin.auth().getUser(uid)

const verifyIdToken = (idToken) => admin.auth().verifyIdToken(idToken)

export {
    db,
    admin,
    verifyUserSessionToken,
    setUserClaims,
    getUser,
    verifyIdToken,
}
