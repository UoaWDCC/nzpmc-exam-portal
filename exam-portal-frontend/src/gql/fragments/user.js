import gql from 'graphql-tag'

export const UserFragment = gql`
    fragment UserFragment on User {
        id
        displayName
        firstName
        lastName
        email
        yearLevel
        photoURL
    }
`
