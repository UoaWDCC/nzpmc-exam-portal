import gql from 'graphql-tag'

export const QuestionFragment = gql`
    fragment QuestionFragment on UserQuizQuestion {
        id
        question
        imageURI
        flag
        created
        modified
    }
`

export const QuestionWithoutFlagFragment = gql`
    fragment QuestionWithoutFlagFragment on UserQuizQuestion {
        id
        question
        imageURI
        created
        modified
    }
`
