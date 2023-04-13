import gql from 'graphql-tag'

export const AdminQuizFragment = gql`
    fragment AdminQuizFragment on Quiz {
        id
        name
    }
`

export const AdminQuizDetailsFragment = gql`
    fragment AdminQuizDetailsFragment on Quiz {
        id
        name
        description
        duration
        startTime
        endTime
    }
`
