import gql from 'graphql-tag'

export const GetUserWithEmailQuery = gql`
  query User($userEmail: String) {
    user(userEmail: $userEmail) {
      id
    }
  }
`
