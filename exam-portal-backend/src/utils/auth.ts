import { firestore } from './firebase'

const isAdminInFirestore = async (userID: string) => {
    const userDoc = await firestore.collection('Users').doc(userID).get()
    if (userDoc.exists) {
        const userData = userDoc.data()
        if (userData?.role === 'admin') {
            return true
        }
    }
    return false
}
export { isAdminInFirestore }
