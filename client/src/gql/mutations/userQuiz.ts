import gql from 'graphql-tag'
import { UserQuizQuestionFragment, UserQuizOptionFragment } from '../fragments/userQuiz'

export const UserQuizUpdateFlagMutation = gql`
  mutation UserQuizUpdateFlagMutation($input: EditUserQuizQuestionInput!) {
    editUserQuizQuestion(input: $input) {
      ...UserQuizQuestionFragment
    }
  }
  ${UserQuizQuestionFragment}
`

export const UserQuizUpdateAnswerMutation = gql`
  mutation UserQuizUpdateAnswerMutation($input: EditUserQuizQuestionInput!) {
    editUserQuizQuestion(input: $input) {
      id
      userAnswer {
        ...UserQuizOptionFragment
      }
    }
  }
  ${UserQuizOptionFragment}
`

export const EditUserQuiz = gql`
  mutation Mutation($input: EditUserQuizInput!) {
    editUserQuiz(input: $input) {
      id
    }
  }
`

export const SubmitUserQuizQuestionsMutation = gql`
  mutation SubmitUserQuizQuestions($input: SubmissionInput!) {
    submitUserQuizQuestions(input: $input) {
      id
    }
  }
`
export const EnrolUsersInQuizMutation = gql`
  mutation EnrolUsersInQuiz($users: [UsersInput!]!, $quizId: ID!) {
    enrolUsersInQuiz(users: $users, quizID: $quizId) {
      id
    }
  }
`
export const UnenrolUsersFromQuizMutation = gql`
  mutation UnenrolUsersFromQuiz($users: [UsersInput!]!, $quizId: ID!) {
    unenrolUsersFromQuiz(users: $users, quizID: $quizId) {
    }
  }
`
