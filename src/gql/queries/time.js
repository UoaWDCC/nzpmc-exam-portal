import gql from 'graphql-tag'

export const CurrentTimeQuery = gql`
    query CurrentTimeQuery {
        currentTime
    }
`

export const GetTimesQuery = gql`
    query GetTimesQuery($quizId: ID!) {
        quiz(quizID: $quizId) {
            startTime
            endTime
        }
    }
`
