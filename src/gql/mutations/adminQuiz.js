import gql from 'graphql-tag'

export const AddQuizMutation = gql`
    mutation AddQuizMutation($input: AddQuizInput!) {
        addQuiz(input: $input) {
            id
            name
            description
            duration
            startTime
            endTime
        }
    }
`

export const EditQuizMutation = gql`
    mutation EditQuizMutation($input: EditQuizInput!) {
        editQuiz(input: $input) {
            id
            name
            description
            duration
            startTime
            endTime
        }
    }
`

export const AddQuestionMutation = gql`
    mutation AddQuestionMutation($input: AddQuestionInput!) {
        addQuestion(input: $input) {
            id
        }
    }
`

export const EditQuestionMutation = gql`
    mutation EditQuestionMutation($input: EditQuestionInput!) {
        editQuestion(input: $input) {
            id
        }
    }
`

export const DeleteQuestionMutation = gql`
    mutation DeleteQuestionMutation($quizId: ID!, $questionId: ID!) {
        deleteQuestion(quizID: $quizId, id: $questionId) {
            id
        }
    }
`

export const AddOptionMutation = gql`
    mutation AddOptionMutation($input: AddOptionInput!) {
        addOption(input: $input) {
            id
            option
        }
    }
`

export const EditOptionMutation = gql`
    mutation EditOptionMutation($input: EditOptionInput!) {
        editOption(input: $input) {
            id
        }
    }
`

export const DeleteOptionMutation = gql`
    mutation DeleteOptionMutation(
        $quizId: ID!
        $questionId: ID!
        $optionId: ID!
    ) {
        deleteOption(quizID: $quizId, id: $questionId, optionID: $optionId) {
            id
        }
    }
`

export const EditAnswerMutation = gql`
    mutation EditAnswerMutation($input: EditAnswerInput!) {
        editAnswer(input: $input) {
            id
        }
    }
`
