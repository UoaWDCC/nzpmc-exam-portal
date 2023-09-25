import gql from 'graphql-tag'

export const EditQuestionMutation = gql`
  mutation EditQuestion($input: EditQuestionInput!) {
    editQuestion(input: $input) {
      id
      modified
    }
  }
`
export const EditOptionMutation = gql`
  mutation EditOption($input: EditOptionInput!) {
    editOption(input: $input) {
      id
      modified
    }
  }
`

export const AddOptionMutation = gql`
  mutation AddOption($input: AddOptionInput!) {
    addOption(input: $input) {
      id
      modified
    }
  }
`
