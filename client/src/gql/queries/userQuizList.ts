import gql from 'graphql-tag';

export const GetUserQuizzesListQuery = gql`
query Query($quizId: ID!) {
  userQuizzesByQuizID(quizID: $quizId) {
    user {
      id
      email
      displayName
      photoURL
      firstName
      lastName
      yearLevel
      role
    }
    score
  }
}
`;