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
): Promise<Schema.UserPage> => {
    if (page < 0) {
        throw new Error('Page cannot be 0 or negative')
    }

    const order = getUsersOrderByInput(orderBy)
    const limits = page * limit
    console.log(order, limits)
    const users = await UserRepository.find()

    // find length of pages
    const total = Math.ceil(users.length / limit)

    users.splice(0, (page - 1) * limit)

    return {
        pages: total,
        users: packUsers(users),
    }
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
    displayName: string,
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
    displayName: string | undefined,
    email: string | undefined,
    photoURL: string | undefined,
    firstName: string | undefined,
    lastName: string | undefined,
    yearLevel: string | undefined,
    role: string | undefined,
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
