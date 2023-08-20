import { getRepository } from 'fireorm'
import { packUser, packUsers } from '../mappers/userMapper'
import { User } from '../models'
import * as Schema from '@nzpmc-exam-portal/common'
import { NotFoundError } from '../utils/errors'
import { admin } from '../utils/firebase'

const UserRepository = getRepository(User)

const getUser = async (
    id?: string | null,
    email?: string | null,
): Promise<Schema.User> => {
    let user: User | null = null
    if (id) {
        try {
            user = await UserRepository.findById(id)
            return packUser(user)
        } catch (e) {
            // Do nothing
        }
    }

    if (email) {
        user = await UserRepository.whereEqualTo(
            'email',
            email.toLowerCase(),
        ).findOne()
    }

    if (!user) {
        throw new NotFoundError(`User id ${id} doesn't exist`)
    }

    return packUser(user)
}

const getAllUsers = async (): Promise<Schema.User[]> => {
    return packUsers(await UserRepository.find())
}

const getUsersPagination = async (
    page: number,
    limit: number,
    orderBy: Schema.UsersOrderByInput,
    term: string,
): Promise<Schema.UserPage> => {
    if (page < 0) {
        throw new Error('Page cannot be 0 or negative')
    }

    const order = getUsersOrderByInput(orderBy)
    const limits = page * limit
    console.log(order, limits)
    const users = await UserRepository.find()

    const sortedUsers = caseInsensitiveSort(orderBy, users)
    // This is dependent that the user has a display name, first name, last name, or email
    // For testing purposes this may not always be the case.
    const finalUsers = sortedUsers.filter(
        (user: User) =>
            user.displayName
                .trim()
                .toLowerCase()
                .includes(term.toLowerCase()) ||
            user.firstName.trim().toLowerCase().includes(term.toLowerCase()) ||
            user.lastName.trim().toLowerCase().includes(term.toLowerCase()) ||
            user.email.trim().toLowerCase().includes(term.toLowerCase()),
    )

    finalUsers.slice((page - 1) * limit, page * limit)

    // find length of pages
    const total = Math.ceil(finalUsers.length / limit)

    return {
        pages: total,
        users: packUsers(finalUsers),
    }
}

const sortUsersList = (users: User[], key: string, isDescending: boolean) => {
    // This is sorting on a key. The key may not exist for all users. (Though it should)
    const sortedUsers = users.sort((user1: User, user2: User) => {
        return user1[key].trim().localeCompare(user2[key].trim(), undefined, {
            sensitivity: 'accent',
        })
    })
    if (isDescending) {
        return sortedUsers.reverse()
    } else {
        return sortedUsers
    }
}

const sortUsersYearLevel = (
    users: User[],
    key: string,
    isDescending: boolean,
) => {
    const sortedUsers = users.sort((user1: User, user2: User) => {
        return parseInt(user1[key].trim()) - parseInt(user2[key].trim())
    })
    if (isDescending) {
        return sortedUsers.reverse()
    } else {
        return sortedUsers
    }
}

const caseInsensitiveSort = (
    orderBy: Schema.UsersOrderByInput,
    users: User[],
) => {
    let sortedUsers: User[]
    let key: string
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

const getUsersOrderByInput = (orderBy: Schema.UsersOrderByInput): string => {
    const direction = (value: Schema.Sort, name: string): string =>
        value === Schema.Sort.Asc ? name : `-${name}`

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
    id: string,
    displayName = '',
    email: string,
    photoURL: string,
    firstName: string,
    lastName: string,
    yearLevel: string,
    role: string,
) => {
    const user = new User()

    user.id = id
    user.displayName = displayName
    user.email = email.toLowerCase()
    user.photoURL = photoURL
    user.firstName = firstName
    user.lastName = lastName
    user.yearLevel = yearLevel
    user.role = role

    const newUser = await UserRepository.create(user)

    return await getUser(newUser.id)
}

const deleteUser = async (id?: string | null, email?: string | null) => {
    try {
        return UserRepository.runTransaction(async (tran) => {
            let user: Schema.User | null = null
            if (id !== null && id !== undefined) {
                user = await tran.findById(id)
            } else if (email !== null && email !== undefined) {
                user = await getUser(null, email)
            }

            if (user === null) {
                throw new NotFoundError()
            }
            if (user.role === 'admin') {
                throw new Error(`Cannot delete admin user: ${user.email}`)
            }
            console.log('deleting user email: ', email, ' from db')
            await tran.delete(user.id)
            await admin.auth().deleteUser(user.id)

            return user
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

const editUser = async (
    id: string,
    displayName?: string,
    email?: string,
    photoURL?: string,
    firstName?: string,
    lastName?: string,
    yearLevel?: string,
    role?: string,
) => {
    return UserRepository.runTransaction(async (tran) => {
        const user = await tran.findById(id)

        if (user === null) {
            throw new NotFoundError()
        }

        user.displayName = displayName ? displayName : user.displayName
        user.email = email ? email : user.email
        user.photoURL = photoURL ? photoURL : user.photoURL
        user.firstName = firstName ? firstName : user.firstName
        user.lastName = lastName ? lastName : user.lastName
        user.yearLevel = yearLevel ? yearLevel : user.yearLevel
        user.role = role ? role : user.role
        user.modified = new Date()
        admin.auth().updateUser(id, {
            displayName: displayName ? displayName : user.displayName,
        })
        await tran.update(user)

        return user
    })
}

export {
    getUser,
    getAllUsers,
    getUsersPagination,
    addUser,
    editUser,
    deleteUser,
}
