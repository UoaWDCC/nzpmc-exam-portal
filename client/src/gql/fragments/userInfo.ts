import gql from 'graphql-tag'

export const UserQuizFragment = gql`
    fragment UserQuizFragment on UserQuiz {
        id
        name
        description
        duration
        startTime
        endTime
    }
`
