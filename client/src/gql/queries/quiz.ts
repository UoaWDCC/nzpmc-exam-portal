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
      released
      questions {
        id
        question
        answerID
        imageURI
        topics
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
