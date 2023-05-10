import { User } from '../models'
import { User as SchemaUser } from '@nzpmc-exam-portal/common'

const packUser = (user: User): SchemaUser => {
    return {
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

const packUsers = (users: User[]): SchemaUser[] => users.map(packUser)

export { packUser, packUsers }
