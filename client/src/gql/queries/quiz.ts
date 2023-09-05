import gql from 'graphql-tag'

export const AllQuizIDQuery = gql`
  query Quizzes {
    quizzes {
      id
      name
    }
  }
`

export const GetQuizInfoQuery = gql`
  query Quiz($quizId: ID!) {
    quiz(quizID: $quizId) {
      id
      name
      description
      duration
      questions {
        id
        question
        imageURI
        topics
        answer {
          id
          option
          created
          modified
        }
        options {
          id
          option
          created
          modified
        }
        created
        modified
      }
      openTime
      closeTime
      created
      modified
    }
  }
`
