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
            if (!parents.answerObj || !parents.answerObj.ref) return null
            return await parents.answerObj.get()
        },
    },
    Query: {},
    Mutation: {
        addQuestion: async (parent, { input }, context) => {
            const { quizID, question, imageURI, numOfAnswers, topics } = input

            const quiz = await getQuiz(quizID)

            return await addQuestion(
                quiz,
                question,
                imageURI,
                numOfAnswers,
                topics,
            )
        },
        editQuestion: async (parent, { input }, context) => {
            const {
                quizID,
                id,
                question,
                imageURI,
                numOfAnswers,
                topics,
            } = input

            const quiz = await getQuiz(quizID)

            return await editQuestion(
                quiz,
                id,
                question,
                imageURI,
                numOfAnswers,
                topics,
            )
        },
    },
}

export default resolvers
