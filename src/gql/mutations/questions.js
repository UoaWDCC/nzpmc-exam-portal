import gql from 'graphql-tag'
import { QuestionFragment } from '../fragments/question'
import { OptionFragment } from '../fragments/option'

export const SwapQuestionMutation = gql`
    mutation SwapQuestion($quizId: ID!, $oldId: ID!, $newId: ID!) {
        swapQuestion(quizID: $quizId, oldID: $oldId, newID: $newId) {
            id
        }
    }
`
