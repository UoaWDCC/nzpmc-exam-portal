import { getRepository, runTransaction } from 'fireorm'
import { packQuestion, packQuestions } from '../mappers/questionMapper'
import { Question, Option, Quiz } from '../models'
import Answer from '../models/answer'
import * as Schema from '../resolvers/resolvers-types'
import { NotFoundError } from '../utils/errors'
import { firestore } from '../utils/firebase'

const QuizRepository = getRepository(Quiz)

const getQuestions = async (
    schemaQuiz: Schema.Quiz,
): Promise<Schema.Question[]> => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(schemaQuiz.id)
        if (!quiz || !quiz.questions) {
            return []
        }

        const questions = await quiz.questions.find()
        return packQuestions(questions)
    })
}

const getQuestion = async (
    schemaQuiz: Schema.Quiz,
    questionID: string,
): Promise<Schema.Question> => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(schemaQuiz.id)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(questionID)
        if (!question) {
            throw new NotFoundError()
        }
        return packQuestion(question)
    })
}

const addQuestion = async (
    schemaQuiz: Schema.Quiz,
    q: string,
    imageURI: string,
    numOfAnswers: number,
    topics: string,
): Promise<Schema.Question> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const AnswerTranRepository = tran.getRepository(Answer)

        const quiz = await QuizTranRepository.findById(schemaQuiz.id)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = new Question()

        question.question = q
        question.imageURI = imageURI
        question.numOfAnswers = numOfAnswers
        question.topics = topics

        const answer = new Answer()
        answer.option = ''

        const newAnswer = await AnswerTranRepository.create(answer)

        const docRef = firestore.collection('Answers').doc(newAnswer.id)
        question.answer = docRef

        const newQuestion = await quiz.questions.create(question)

        return packQuestion(newQuestion)
    })
}

const editQuestion = async (
    schemaQuiz: Schema.Quiz,
    id: string,
    q: string | undefined,
    imageURI: string | undefined,
    numOfAnswers: number | undefined,
    answer: string | undefined,
    topics: string | undefined,
): Promise<Schema.Question> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const AnswerTranRepository = tran.getRepository(Answer)
        const quiz = await QuizTranRepository.findById(schemaQuiz.id)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(id)
        if (!question) {
            throw new NotFoundError()
        }

        question.question = q ? q : question.question
        question.imageURI = imageURI ? imageURI : question.imageURI
        question.numOfAnswers = numOfAnswers
            ? numOfAnswers
            : question.numOfAnswers
        question.topics = topics ? topics : question.topics
        question.modified = new Date()

        if (answer !== undefined) {
            const answerObj = await AnswerTranRepository.findById(
                question.answer.id,
            )
            answerObj.option = answer
            await AnswerTranRepository.update(answerObj)
        }

        quiz.questions.update(question)

        return packQuestion(question)
    })
}

export { getQuestions, getQuestion, addQuestion, editQuestion }
