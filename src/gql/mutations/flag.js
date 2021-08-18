import gql from 'graphql-tag'
import { QuestionFragment } from '../fragments/question'

export const UpdateFlagMutation = gql`
    mutation UpdateFlagMutation($input: EditUserQuizQuestion!) {
        editUserQuizQuestion(input: $input) {
            ...QuestionFragment
        }
    }
    ${QuestionFragment}
`
