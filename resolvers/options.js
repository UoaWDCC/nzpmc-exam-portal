import {
    getQuestion,
    getQuiz,
    addQuestionOption,
    editQuestionOption,
    upsertQuestionAnswer,
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
        editAnswer: async (parent, { input }, context) => {
            const { quizID, questionID, option } = input

            const quiz = await getQuiz(quizID)

            const question = await getQuestion(quiz, questionID)
            // console.log(question, questionID)

            return await upsertQuestionAnswer(question, option)
        },
    },
}

export default resolvers
