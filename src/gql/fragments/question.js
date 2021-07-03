import gql from 'graphql-tag'

export const QuestionFragment = gql`
    fragment QuestionFragment on UserQuizQuestion {
        id
        question
        imageURI
        created
        modified
    }
`
