import gql from 'graphql-tag'
import { OptionFragment } from '../fragments/option'
import { QuestionFragment } from '../fragments/question'

export const QuestionsQuery = gql`
    query QuestionsQuery($quizID: ID!) {
        userQuiz(quizID: $quizID) {
            questions {
                ...QuestionFragment
                options {
                    ...OptionFragment
                }
                userAnswer {
                    ...OptionFragment
                }
            }
        }
    }
    ${OptionFragment}
    ${QuestionFragment}
`

export const QuestionQuery = gql`
    query QuestionQuery($quizID: ID!, $questionID: ID!) {
        userQuiz(quizID: $quizID) {
            question(id: $questionID) {
                ...QuestionFragment
            }
        }
    }
    ${QuestionFragment}
`
