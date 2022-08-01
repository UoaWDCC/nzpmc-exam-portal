import gql from 'graphql-tag'
import {
    UserQuizFragment,
    UserQuizQuestionFragment,
    UserQuizOptionFragment,
} from '../fragments/userQuiz'

export const EditQuizMutation = gql`
    mutation StartTimeMutation($input: EditUserQuizInput!) {
        editUserQuiz(input: $input) {
            ...UserQuizFragment
        }
    }
    ${UserQuizFragment}
`

export const UserQuizUpdateFlagMutation = gql`
    mutation UserQuizUpdateFlagMutation($input: EditUserQuizQuestionInput!) {
        editUserQuizQuestion(input: $input) {
            ...UserQuizQuestionFragment
        }
    }
    ${UserQuizQuestionFragment}
`

export const UserQuizUpdateAnswerMutation = gql`
    mutation UserQuizUpdateAnswerMutation($input: EditUserQuizQuestionInput!) {
        editUserQuizQuestion(input: $input) {
            id
            userAnswer {
                ...UserQuizOptionFragment
            }
        }
    }
    ${UserQuizOptionFragment}
`
