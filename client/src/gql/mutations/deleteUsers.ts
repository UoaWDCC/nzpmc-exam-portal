import gql from 'graphql-tag'

export const DeleteUserMutation = gql`
  mutation DeleteUser($deleteUserId: ID, $deleteUserEmail: String) {
    deleteUser(id: $deleteUserId, email: $deleteUserEmail) {
      id
      email
    }
  }
`
