import gql from 'graphql-tag';

export const GetUserQuizzesListQuery = gql`
query Query($quizId: ID!) {
  userQuizzesByQuizID(quizID: $quizId) {
    user {
      id
      firstName
      lastName
      yearLevel
    }
    score
  }
}
`;