import gql from 'graphql-tag'
import { AdminQuizFragment } from '../fragments/adminQuiz'
import { AdminQuizDetailsFragment } from '../fragments/adminQuiz'

export const AdminQuizzesQuery = gql`
    query AdminQuizzesQuery {
        quizzes {
            ...AdminQuizFragment
        }
    }
    ${AdminQuizFragment}
`

export const AdminQuizDetailsQuery = gql`
    query AdminQuizDetailsQuery($quizID: ID!) {
        quiz(quizID: $quizID) {
            ...AdminQuizDetailsFragment
        }
    }
    ${AdminQuizDetailsFragment}
`
