import gql from 'graphql-tag'

// this will need marked tag soon
export const UserQuizFragment = gql`
  fragment UserQuizFragment on UserQuiz {
    id
    name
    quizID
    description
    duration
    openTime
    closeTime
    quizStart
    submitted
    score
    created
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
