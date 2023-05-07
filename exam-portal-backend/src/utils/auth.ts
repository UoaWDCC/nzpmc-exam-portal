import { firestore } from './firebase'
import axios from 'axios'
import { admin } from './firebase'

export const isAdminInFirestore = async (userID: string) => {
    const userDoc = await firestore.collection('Users').doc(userID).get()
    if (userDoc.exists) {
        const userData = userDoc.data()
        if (userData?.role === 'admin') {
            return true
        }
    }
    return false
}

export const generateNewToken = async (uid: string): Promise<string> => {
    const customToken = await admin.auth().createCustomToken(uid)
    const res = await axios.post(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.FIREBASE_API_KEY}`,
        {
            token: customToken,
            returnSecureToken: true,
        },
    )
    const newToken = res.data.idToken
    return newToken
}
// Only applies after refreshing the token
export const addAdminClaim = async (uid: string): Promise<void> => {
    await admin.auth().setCustomUserClaims(uid, { admin: true })
}

export const removeAdminClaim = async (uid: string): Promise<void> => {
    await admin.auth().setCustomUserClaims(uid, { admin: false })
}
