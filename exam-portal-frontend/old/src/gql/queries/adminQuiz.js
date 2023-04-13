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

export const AdminQuizQuestionsQuery = gql`
    query AdminQuizQuestionsQuery($quizID: ID!) {
        quiz(quizID: $quizID) {
            id
            questions {
                id
                question
            }
        }
    }
`

export const AdminQuizQuestionDetailsQuery = gql`
    query AdminQuizQuestionDetailsQuery($quizId: ID!, $questionId: ID!) {
        quiz(quizID: $quizId) {
            id
            question(id: $questionId) {
                id
                question
                answer {
                    id
                    option
                }
                options {
                    id
                    option
                }
            }
        }
    }
`
