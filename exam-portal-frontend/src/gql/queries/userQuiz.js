import gql from 'graphql-tag'
import {
    UserQuizFragment,
    UserQuizQuestionFragment,
    UserQuizFullQuestionFragment,
    UserQuizOptionFragment,
} from '@/gql/fragments/userQuiz'

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
                ...UserQuizQuestionFragment
                userAnswer {
                    id
                }
            }
        }
    }
    ${UserQuizFragment}
    ${UserQuizQuestionFragment}
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
