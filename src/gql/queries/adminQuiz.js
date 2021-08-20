import gql from 'graphql-tag'
import { AdminQuizFragment } from '../fragments/adminQuiz'

export const AdminQuizzesQuery = gql`
    query AdminQuizzesQuery {
        quizzes {
            ...AdminQuizFragment
        }
    }
    ${AdminQuizFragment}
`
