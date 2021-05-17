import * as firebaseAdmin from 'firebase-admin'
const admin = firebaseAdmin.initializeApp({
    credential: admin.credential.applicationDefault(),
})

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

const firestore = admin.firestore()

export {
    firestore,
    admin,
    verifyUserSessionToken,
    setUserClaims,
    getUser,
    verifyIdToken,
}
