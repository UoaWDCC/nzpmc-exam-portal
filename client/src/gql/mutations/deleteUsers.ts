import gql from 'graphql-tag'

export const DeleteUserMutation = gql`
  mutation DeleteUser($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId) {
      id
    }
  }
`
