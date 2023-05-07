import { AdminAuthenticationError } from './errors'
import { getUser } from '../controllers'
import { firestore } from './firebase'

// READ https://www.apollographql.com/docs/apollo-server/data/errors/
const checkRole = async (userID: string) => {
    const currentUser = await getUser(userID)
    if (currentUser.role !== 'admin') {
        throw new AdminAuthenticationError()
    }
}

const isAdminInFirestore = async (userID: string) => {
    return true
    const userDoc = await firestore.collection('users').doc(userID).get()
    if (userDoc.exists) {
        const userData = userDoc.data()
        if (userData?.role === 'admin') {
            return true
        }
    }
    return false
}
export { isAdminInFirestore }
