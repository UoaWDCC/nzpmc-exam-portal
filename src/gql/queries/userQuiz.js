import gql from 'graphql-tag'
import { UserQuizFragment } from '../fragments/userQuiz'

export const UserQuizzesQuery = gql`
    query UserQuizzesQuery {
        userQuizzes {
            ...UserQuizFragment
        }
    }
    ${UserQuizFragment}
`

export const UserQuizQuery = gql`
    query UserQuizQuery($quizID: ID!) {
        userQuiz(quizID: $quizID) {
            ...UserQuizFragment
        }
    }
    ${UserQuizFragment}
`
