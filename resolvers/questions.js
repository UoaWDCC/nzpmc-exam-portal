import {
    addQuestion,
    editQuestion,
    getOptionKey,
    getQuestionOptions,
    getQuiz,
} from '../controllers'

const resolvers = {
    Question: {
        options: async (parents, args, context) => {
            return await getQuestionOptions(parents)
        },
        answer: async (parents, args, context) => {
            if (!parents.answerObj.ref) return null

            return await parents.answerObj.get()
        },
    },
    Query: {},
    Mutation: {
        addQuestion: async (parent, { input }, context) => {
            const { quizID, question, numOfAnswers, topics } = input

            const quiz = await getQuiz(quizID)

            return await addQuestion(quiz, question, numOfAnswers, topics)
        },
        editQuestion: async (parent, { input }, context) => {
            const { quizID, id, question, numOfAnswers, topics } = input

            const quiz = await getQuiz(quizID)

            return await editQuestion(quiz, id, question, numOfAnswers, topics)
        },
    },
}

export default resolvers
