import gql from 'graphql-tag'
export const EditQuizMutation = gql`
  mutation Mutation($input: EditQuizInput!) {
    editQuiz(input: $input) {
      id
      modified
    }
  }
`
export const CreateQuizMutation = gql`
  mutation AddQuiz($input: AddQuizInput!) {
    addQuiz(input: $input) {
      id
    }
  }
`
