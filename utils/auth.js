import { AdminAuthenticationError } from 'errors'

// READ https://www.apollographql.com/docs/apollo-server/data/errors/
const checkRole = async (userID) => {
    let currentUser = await getUser(userID)
    if (currentUser.role !== "admin") {
        throw new AdminAuthenticationError();
    }
}

export default { checkRole }