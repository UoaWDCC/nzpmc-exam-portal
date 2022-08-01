import gql from 'graphql-tag'

export const UserQuizFragment = gql`
    fragment UserQuizFragment on UserQuiz {
        id
        name
        description
        score
        duration
        startTime
        endTime
        created
        modified
    }
`

export const UserQuizQuestionFragment = gql`
    fragment UserQuizQuestionFragment on UserQuizQuestion {
        id
        flag
    }
`

export const UserQuizFullQuestionFragment = gql`
    fragment UserQuizFullQuestionFragment on UserQuizQuestion {
        id
        question
        flag
    }
`

export const UserQuizOptionFragment = gql`
    fragment UserQuizOptionFragment on Option {
        id
        option
    }
`
