import gql from 'graphql-tag'
import { QuestionFragment } from '../fragments/question'
import { OptionFragment } from '../fragments/option'

export const UpdateUserAnswerMutation = gql`
    mutation UpdateUserAnswerMutation($input: EditUserQuizQuestionInput!) {
        editUserQuizQuestion(input: $input) {
            ...QuestionFragment
            userAnswer {
                ...OptionFragment
            }
        }
    }
    ${QuestionFragment}
    ${OptionFragment}
`
