import gql from 'graphql-tag'
import { OptionFragment } from '../fragments/option'

export const OptionsQuery = gql`
    query OptionsQuery($quizID: ID!) {
        userQuiz(quizID: $quizID) {
            question(id: $questionId) {
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
`
