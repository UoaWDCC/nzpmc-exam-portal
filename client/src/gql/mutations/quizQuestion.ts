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
  mutation DeleteQuestion($quizID: ID!, $deleteQuestionID: ID!) {
    deleteQuestion(quizID: $quizID, id: $deleteQuestionID) {
      answer {
        id
      }
      id
    }
  }
`

export const DeleteOptionMutation = gql`
  mutation DeleteOption($quizID: ID!, $questionID: ID!, $optionID: ID!) {
    deleteOption(quizID: $quizID, questionID: $questionID, optionID: $optionID) {
      id
    }
  }
`
