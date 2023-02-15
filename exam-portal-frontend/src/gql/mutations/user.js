import gql from 'graphql-tag'
import { UserFragment } from '../fragments/user'

export const EditUser = gql`
    mutation EditUser($input: EditUserInput!) {
        editUser(input: $input) {
            ...UserFragment
        }
    }
    ${UserFragment}
`

export const AddUser = gql`
    mutation AddUser($input: AddUserInput!) {
        addUser(input: $input) {
            ...UserFragment
        }
    }
    ${UserFragment}
`
