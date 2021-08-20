import gql from 'graphql-tag'

export const AdminQuizFragment = gql`
    fragment AdminQuizFragment on Quiz {
        id
        name
    }
`
