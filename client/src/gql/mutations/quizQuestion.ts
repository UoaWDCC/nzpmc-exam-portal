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

export const EditAnswerMutation = gql`
  mutation EditAnswer($input: EditAnswerInput!) {
    editAnswer(input: $input) {
      id
    }
  }
`
export const AddQuestionMutation = gql`
  mutation AddQuestion($input: AddQuestionInput!) {
    addQuestion(input: $input) {
      id
      modified
    }
  }
`

export const DeleteQuestionMutation = gql`
  mutation DeleteQuestion($quizId: ID!, $deleteQuestionId: ID!) {
    deleteQuestion(quizID: $quizId, id: $deleteQuestionId) {
      answer {
        id
      }
      id
    }
  }
`

export const DeleteOptionMutation = gql`
  mutation DeleteOption($quizId: ID!, $questionId: ID!, $optionId: ID!) {
    deleteOption(quizID: $quizId, questionID: $questionId, optionID: $optionId) {
      id
    }
  }
`
