import gql from 'graphql-tag';

export const GetUserListQuery = gql`
query Query {
    users {
        users {
            id
            email
            displayName
            photoURL
            firstName
            lastName
            yearLevel
            role
            }
    }
  }
  
`;