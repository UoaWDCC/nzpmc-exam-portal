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

export const AddOptionMutation = gql`
    mutation AddOptionMutation($input: AddOptionInput!) {
        addOption(input: $input) {
            id
        }
    }
`
