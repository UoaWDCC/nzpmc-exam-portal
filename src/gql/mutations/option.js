import gql from 'graphql-tag'
import { OptionFragment } from '../fragments/option'

export const UpdateUserAnswerMutation = gql`
    mutation UpdateUserAnswerMutation($input: EditUserQuizQuestion!) {
        editUserQuizQuestion(input: $input) {
            ...OptionFragment
        }
    }
    ${OptionFragment}
`
