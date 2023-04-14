import { getRepository } from 'fireorm'
import { packUser, packUsers } from '../mappers/userMapper'
import { User } from '../models'
import * as Schema from '../resolvers/resolvers-types'
import { NotFoundError } from '../utils/errors'

const UserRepository = getRepository(User)

const getUser = async (id: string): Promise<Schema.User> => {
    return packUser(await UserRepository.findById(id))
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

    const finalUsers = sortedUsers.filter(
        (user: any) =>
            user.displayName
                .trim()
                .toLowerCase()
                .includes(term.toLowerCase()) ||
            user.firstName.trim().toLowerCase().includes(term.toLowerCase()) ||
            user.lastName.trim().toLowerCase().includes(term.toLowerCase()),
    )

    finalUsers.slice((page - 1) * limit, page * limit)

    // find length of pages
    const total = Math.ceil(finalUsers.length / limit)

    return {
        pages: total,
        users: packUsers(finalUsers),
    }
}

const sortUsersList = (users: any, key: string, isDescending: boolean) => {   
    const sortedUsers = users.sort((user1: any, user2: any) => {
        user1[key].trim().localeCompare(user2[key].trim(), undefined, {
            sensitivity: 'accent',
        })
    })
    if (isDescending) {
        return sortedUsers.reverse()
    } else {
        return sortedUsers
    }
}

const sortUsersYearLevel = (users: any, key: string, isDescending: boolean) => {
    const sortedUsers = users.sort((user1: any, user2: any) => {
        parseInt(user1[key].trim()) - parseInt(user2[key].trim())
    })
    if (isDescending) {
        return sortedUsers.reverse()
    } else {
        return sortedUsers
    }
}

const caseInsensitiveSort = (orderBy: Schema.UsersOrderByInput, users: any) => {
    let sortedUsers: any
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
    user.email = email
    user.photoURL = photoURL
    user.firstName = firstName
    user.lastName = lastName
    user.yearLevel = yearLevel
    user.role = role

    const newUser = await UserRepository.create(user)

    return await getUser(newUser.id)
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

        await tran.update(user)

        return user
    })
}

export { getUser, getAllUsers, getUsersPagination, addUser, editUser }
