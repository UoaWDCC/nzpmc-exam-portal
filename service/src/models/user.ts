import { Collection } from 'fireorm'
import { IsDataURI, IsEmail, IsOptional } from 'class-validator'

@Collection()
class User {
    id!: string
    displayName!: string

    @IsOptional()
    @IsEmail()
    email!: string

    @IsDataURI()
    photoURL!: string
    firstName!: string
    lastName!: string
    yearLevel!: string
    role!: string
    created: Date = new Date()
    modified: Date = new Date()
    deleted: Date | null = null
}

export default User
