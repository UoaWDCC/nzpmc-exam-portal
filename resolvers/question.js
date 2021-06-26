import { addQuestion, getQuestionOptions, getQuiz } from '../controllers'

const resolvers = {
    Question: {
        options: async (parents, args, context) => {
            return await getQuestionOptions(parents.id)
        },
    },
    Query: {},
    Mutation: {
        addQuestion: async (parent, { input }, context) => {
            const { quizID, question, numOfAnswers, topics } = input

            const quiz = await getQuiz(quizID)
            console.log(quiz)

            return await addQuestion(quiz, question, numOfAnswers, topics)
        },
        editQuestion: async (parent, { input }, context) => {
            const { quizID, id, question, numOfAnswers, topics } = input

            const quiz = await getQuiz(quizID)

            return await addQuestion(id, quiz, question, numOfAnswers, topics)
        },
    },
}

export default resolvers
