import User from '../models'

const getUser = async (id) => {
    const user = await User.collection.get({ id })
    return {
        id: user.id,
        firstName: user.firstname,
        lastName: user.surname,
        yearLevel: user.yearLevel,
        role: user.role,
        created: user.created,
        modified: user.modified,
    }
}

export { getUser }
