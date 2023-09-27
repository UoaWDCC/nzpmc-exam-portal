import gql from 'graphql-tag'
import { UserQuizOptionFragment } from '@/gql/fragments/userQuiz'

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
        options {
          id
          option
          created
          modified
        }
        created
        modified
        answer {
          ...UserQuizOptionFragment
        }
      }
      openTime
      closeTime
      created
      modified
    }
  }
  ${UserQuizOptionFragment}
`
