import gql from 'graphql-tag'
import { OptionFragment } from '../fragments/option'

export const UpdateUserAnswerQuery = gql`
    mutation UpdateUserAnswerQuery($input: EditUserQuizQuestion!) {
        editUserQuizQuestion(input: $input) {
            ...OptionFragment
        }
    }
    ${OptionFragment}
`
