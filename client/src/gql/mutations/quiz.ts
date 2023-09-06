import gql from 'graphql-tag'
export const EditQuizMutation = gql`
  mutation Mutation($input: EditQuizInput!) {
    editQuiz(input: $input) {
      id
      modified
    }
  }
`
export const CreateExamMutation = gql`
  mutation AddQuiz($input: AddQuizInput!) {
    addQuiz(input: $input) {
      id
    }
  }
`
