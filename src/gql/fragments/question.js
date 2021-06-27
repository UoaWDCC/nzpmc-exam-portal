import gql from 'graphql-tag'

export const QuestionFragment = gql`
    fragment QuestionFragment on Question {
        id
        question
        topics
        numOfAnswer
        created
        modified
    }
`
