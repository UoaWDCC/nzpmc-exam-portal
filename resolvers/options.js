import {
    getQuestion,
    getQuiz,
    addQuestionOption,
    editQuestionOption,
    addQuestionAnswer,
    editQuestionAnswer,
} from '../controllers'

const resolvers = {
    Query: {},
    Mutation: {
        addOption: async (parent, { input }, context) => {
            const { quizID, questionID, option } = input

            const quiz = await getQuiz(quizID)

            const question = await getQuestion(quiz, questionID)

            return await addQuestionOption(question, option)
        },
        editOption: async (parent, { input }, context) => {
            const { quizID, questionID, option, id } = input

            const quiz = await getQuiz(quizID)

            const question = await getQuestion(quiz, questionID)

            return await editQuestionOption(question, id, option)
        },
        addAnswer: async (parent, { input }, context) => {
            const { quizID, questionID, option } = input

            const quiz = await getQuiz(quizID)

            const question = await getQuestion(quiz, questionID)

            return await addQuestionAnswer(question, option)
        },
        editAnswer: async (parent, { input }, context) => {
            const { quizID, questionID, option } = input

            const quiz = await getQuiz(quizID)

            const question = await getQuestion(quiz, questionID)

            return await editQuestionAnswer(question, option)
        },
    },
}

export default resolvers
