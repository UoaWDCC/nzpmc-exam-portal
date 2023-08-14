import gql from 'graphql-tag'

export const AllQuizIDQuery = gql`
  query Quizzes {
    quizzes {
      id
      name
    }
  }
`
