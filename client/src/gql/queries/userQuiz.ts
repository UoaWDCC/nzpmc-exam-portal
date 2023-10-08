import gql from 'graphql-tag'
import {
  UserQuizFragment,
  UserQuizFullQuestionFragment,
  UserQuizQuestionFragment,
  UserQuizOptionFragment
} from '@/gql/fragments/userQuiz'

export const UserQuizzesQuery = gql`
  query UserQuizzesQuery {
    userQuizzes {
      submitted
      ...UserQuizFragment
      questions {
        ...UserQuizQuestionFragment
      }
    }
  }
  ${UserQuizFragment}
  ${UserQuizQuestionFragment}
`

export const UserQuizQuery = gql`
  query UserQuizQuery($quizID: ID!) {
    userQuiz(quizID: $quizID) {
      ...UserQuizFragment
      questions {
        ...UserQuizFullQuestionFragment
        options {
          ...UserQuizOptionFragment
        }
        userAnswer {
          id
        }
      }
    }
  }
  ${UserQuizFragment}
  ${UserQuizFullQuestionFragment}
  ${UserQuizOptionFragment}
`

export const UserQuizFullQuestionQuery = gql`
  query UserQuizFullQuestionQuery($quizID: ID!, $questionID: ID!) {
    userQuiz(quizID: $quizID) {
      id
      question(id: $questionID) {
        ...UserQuizFullQuestionFragment
        options {
          ...UserQuizOptionFragment
        }
        userAnswer {
          id
        }
      }
    }
  }
  ${UserQuizFullQuestionFragment}
  ${UserQuizOptionFragment}
`

export const UserQuizzesByQuizIDQuery = gql`
  query UserQuizzesByQuizID($quizID: ID!) {
    userQuizzesByQuizID(quizID: $quizID) {
      id
      user {
        displayName
        email
        firstName
        lastName
        id
        yearLevel
      }
      submitted
      score
    }
  }
`
