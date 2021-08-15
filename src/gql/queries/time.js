import gql from 'graphql-tag'

export const CurrentTimeQuery = gql`
    query CurrentTimeQuery {
        currentTime
    }
`
