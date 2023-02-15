import gql from 'graphql-tag'

export const SwapQuestionMutation = gql`
    mutation SwapQuestion($quizId: ID!, $oldId: ID!, $newId: ID!) {
        swapQuestion(quizID: $quizId, oldID: $oldId, newID: $newId) {
            id
        }
    }
`
