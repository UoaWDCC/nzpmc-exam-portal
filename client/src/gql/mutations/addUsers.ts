import gql from 'graphql-tag'

export const AddUserMutation = gql`
  mutation Mutation($input: AddUserInput!) {
    addUser(input: $input) {
      id
    }
  }
`
