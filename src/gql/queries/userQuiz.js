import gql from 'graphql-tag'
import { UserQuizFragment } from '../fragments/userQuiz'
import { OptionFragment } from '../fragments/option'
import { QuestionFragment } from '../fragments/question'

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
            questions {
                ...QuestionFragment
            }
        }
    }
    ${UserQuizFragment}
    ${QuestionFragment}
`
