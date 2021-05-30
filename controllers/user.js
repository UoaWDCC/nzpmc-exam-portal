import { Fireo } from 'fireo'
import { User } from '../models'

const packUser = (user) => {
    return {
        key: user.key,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        yearLevel: user.yearLevel,
        role: user.role,
        created: user.created,
        modified: user.modified,
    }
}

const packUsers = (users) => users.map(packUser)

const getUser = async (id) => {
    const user = await User.collection.get({ id })
    return packUser(user)
}

const getAllUsers = async () => {
    const users = (
        await User.collection.fetch()
    ).list
    return packUsers(users);
}

const createUser = async ({ firstName, lastName, yearLevel, role }) => {
    const user = User.init()

    user.firstName = firstName
    user.lastName = lastName
    user.yearLevel = yearLevel
    user.role = role
    user.created = new Date()
    user.modified = new Date()

    await user.save()

    return await getUser(user.id)
}

const updateUser = async ({ id, firstName, lastName, yearLevel }) => {
    return await Fireo.runTransaction(async (t) => {
        const user = getUser(id)

        user.firstName = firstName ? firstName : user.firstName
        user.lastName = lastName ? lastName : user.lastName
        user.yearLevel = yearLevel ? yearLevel : user.yearLevel
        user.modified = new Date()

        await user.update()

        return user
    })
}

export { getUser, getAllUsers, createUser, updateUser, packUser }
