import gql from 'graphql-tag'

export const AddQuizMutation = gql`
    mutation AddQuizMutation($input: AddQuizInput!) {
        addQuiz(input: $input) {
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
