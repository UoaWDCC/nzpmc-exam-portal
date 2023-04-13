import gql from 'graphql-tag'
import { QuestionFragment } from '../fragments/question'

export const UpdateFlagMutation = gql`
    mutation UpdateFlagMutation($input: EditUserQuizQuestionInput!) {
        editUserQuizQuestion(input: $input) {
            ...QuestionFragment
        }
    }
    ${QuestionFragment}
`
