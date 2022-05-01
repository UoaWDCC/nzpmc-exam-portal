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

export const AddQuestion = gql`
    mutation AddQuestion($input: AddQuestionInput!) {
        addQuestion(input: $input) {
            id
            question
            imageURI
            numOfAnswers
            topics
            answer {
                id
                option
                created
                modified
            }
            options {
                id
                option
                created
                modified
            }
            created
            modified
        }
    }
`

export const AddQuestionMutation = gql`
    mutation AddQuestionMutation($input: AddQuestionInput!) {
        addQuestion(input: $input) {
            question
            numOfAnswers
            topics
            imageURI
        }
    }
`

export const EditQuestionMutation = gql`
    mutation EditQuestionMutation($input: EditQuestionInput!) {
        editQuestion(input: $input) {
            id
            quizID
            question
            numOfAnswers
            topics
            imageURI
        }
    }
`
