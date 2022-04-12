import { Fireo } from 'fireo'
import { User } from '../models'

const packUser = (user) => {
    return {
        key: user.key,
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
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
    const users = (await User.collection.fetch()).list
    return packUsers(users)
}

const getUsersPagination = async (page, limit, orderBy) => {
    if (page < 0) {
        throw new Error('Page cannot be 0 or negative')
    }

    const order = getUsersOrderByInput(orderBy)
    const limits = page * limit
    console.log(order, limits)
    const users = (await User.collection.orderBy(order).limit(limits).fetch()).list

    // find length of pages
    const total = Math.ceil(users.length / limit)

    console.log(users.length)

    users.splice(0, (page - 1) * limit)

    console.log(users.length)

    return {
        total: total,
        users: packUsers(users),
    }
}

const getUsersOrderByInput = (orderBy) => {
    const direction = (value, name) => (value === 'ASC' ? name : `-${name}`)

    if (orderBy.displayName) {
        return direction(orderBy.displayName, 'displayName')
    }
    if (orderBy.email) {
        return direction(orderBy.email, 'email')
    }
    if (orderBy.firstName) {
        return direction(orderBy.firstName, 'firstName')
    }
    if (orderBy.lastName) {
        return direction(orderBy.lastName, 'lastName')
    }
    if (orderBy.yearLevel) {
        return direction(orderBy.yearLevel, 'yearLevel')
    }
    throw new Error('Invalid orderBy input')
}

const addUser = async (
    id,
    displayName,
    email,
    photoURL,
    firstName,
    lastName,
    yearLevel,
    role,
) => {
    const user = User.init()

    user.id = id
    user.displayName = displayName
    user.email = email
    user.photoURL = photoURL
    user.firstName = firstName
    user.lastName = lastName
    user.yearLevel = yearLevel
    user.role = role
    user.created = new Date()
    user.modified = new Date()

    await user.save()

    return await getUser(user.id)
}

const editUser = async (
    id,
    displayName,
    email,
    photoURL,
    firstName,
    lastName,
    yearLevel,
) => {
    return await Fireo.runTransaction(async (t) => {
        const user = await User.collection.get({ id })

        user.displayName = displayName ? displayName : user.displayName
        user.email = email ? email : user.email
        user.photoURL = photoURL ? photoURL : user.photoURL
        user.firstName = firstName ? firstName : user.firstName
        user.lastName = lastName ? lastName : user.lastName
        user.yearLevel = yearLevel ? yearLevel : user.yearLevel
        user.created = user.created.toDate()
        user.modified = new Date()

        await user.update()

        return user
    })
}

export { getUser, getAllUsers, getUsersPagination, addUser, editUser }
