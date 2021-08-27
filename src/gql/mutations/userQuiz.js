import gql from 'graphql-tag'
import { UserQuizFragment } from '../fragments/userQuiz'

export const EditQuizMutation = gql`
    mutation StartTimeMutation($input: EditUserQuizInput!) {
        editUserQuiz(input: $input) {
            ...UserQuizFragment
        }
    }
    ${UserQuizFragment}
`
