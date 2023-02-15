import gql from 'graphql-tag'
import { OptionFragment } from '../fragments/option'
import {
    QuestionFragment,
    QuestionWithoutFlagFragment,
} from '../fragments/question'

export const QuestionsQuery = gql`
    query QuestionsQuery($quizID: ID!) {
        userQuiz(quizID: $quizID) {
            id
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
            id
            question(id: $questionID) {
                ...QuestionWithoutFlagFragment
            }
        }
    }
    ${QuestionWithoutFlagFragment}
`
