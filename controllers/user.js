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

const getUsersPagination = async (page, limit, orderBy, term) => {
    if (page < 0) {
        throw new Error('Page cannot be 0 or negative')
    }

    const order = getUsersOrderByInput(orderBy)
    const limits = page * limit
    console.log(order, limits)
    const users = (await User.collection.orderBy(order).fetch()).list

    const sortedUsers = caseInsensitiveSort(orderBy, users)
    const finalUsers = sortedUsers.filter(
        (user) =>
            user.displayName
                .trim()
                .toLowerCase()
                .includes(term.toLowerCase()) ||
            user.firstName.trim().toLowerCase().includes(term.toLowerCase()) ||
            user.lastName.trim().toLowerCase().includes(term.toLowerCase()),
    )

    // find length of pages
    const total = Math.ceil(finalUsers.length / limit)

    const finalUsersSliced = finalUsers.slice((page - 1) * limit, page * limit)

    console.log(finalUsers.length)

    return {
        pages: total,
        users: packUsers(finalUsersSliced),
    }
}

const sortUsersList = (users, key, isDescending) => {
    const sortedUsers = users.sort((user1, user2) =>
        user1[key].trim().localeCompare(user2[key].trim(), undefined, {
            sensitivity: 'accent',
        }),
    )
    if (isDescending) {
        return sortedUsers.reverse()
    } else {
        return sortedUsers
    }
}

const sortUsersYearLevel = (users, key, isDescending) => {
    const sortedUsers = users.sort(
        (user1, user2) =>
            parseInt(user1[key].trim()) - parseInt(user2[key].trim()),
    )
    if (isDescending) {
        return sortedUsers.reverse()
    } else {
        return sortedUsers
    }
}

const caseInsensitiveSort = (orderBy, users) => {
    let sortedUsers
    let key
    if (orderBy.displayName) {
        key = 'displayName'
        sortedUsers = sortUsersList(users, key, orderBy.displayName === 'DESC')
        return sortedUsers
    } else if (orderBy.email) {
        key = 'email'
        sortedUsers = sortUsersList(users, key, orderBy.email === 'DESC')
        return sortedUsers
    } else if (orderBy.firstName) {
        key = 'firstName'
        sortedUsers = sortUsersList(users, key, orderBy.firstName === 'DESC')
        return sortedUsers
    } else if (orderBy.lastName) {
        key = 'lastName'
        sortedUsers = sortUsersList(users, key, orderBy.lastName === 'DESC')
        return sortedUsers
    } else if (orderBy.yearLevel) {
        key = 'yearLevel'
        sortedUsers = sortUsersYearLevel(
            users,
            key,
            orderBy.yearLevel === 'DESC',
        )
        return sortedUsers
    }
    throw new Error('Invalid orderBy input')
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
