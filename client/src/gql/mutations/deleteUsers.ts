import gql from 'graphql-tag'

export const DeleteUserMutation = gql`
  mutation Mutation($id: ID!) {
    deleteUser(input: $id) {
      id
    }
  }
`
