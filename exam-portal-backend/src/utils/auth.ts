import { AdminAuthenticationError } from './errors'
import { getUser } from '../controllers'

// READ https://www.apollographql.com/docs/apollo-server/data/errors/
const checkRole = async (userID: string) => {
    const currentUser = await getUser(userID)
    if (currentUser.role !== 'admin') {
        throw new AdminAuthenticationError()
    }
}

const isAdminInFirestore = async (userID: string) => {
    const currentUser = await getUser(userID)
    if (currentUser.role === 'admin') {
        return true
    }
    return false
}
export { checkRole, isAdminInFirestore }
