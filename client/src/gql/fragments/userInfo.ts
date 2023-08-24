import gql from 'graphql-tag'

export const UserQuizFragment = gql`
  fragment UserQuizFragment on UserQuiz {
    id
    name
    description
    duration
    openTime
    endTime
    submitted
  }
`
