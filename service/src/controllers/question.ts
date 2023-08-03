import { getRepository, runTransaction } from 'fireorm'
import { packQuestion, packQuestions } from '../mappers/questionMapper'
import { Question, Quiz } from '../models'
import Option from '../models/option'
import { QuestionModel } from '@nzpmc-exam-portal/common'
import { NotFoundError } from '../utils/errors'

const QuizRepository = getRepository(Quiz)

const getQuestions = async (quizID: string): Promise<QuestionModel[]> => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(quizID)
        if (!quiz || !quiz.questions) {
            return []
        }
        // filter order by question id
        const order = quiz.questionIDsOrder
        const questions = await quiz.questions.find()
        order.reverse()
        questions.sort((a, b) => {
            return order.indexOf(b.id) - order.indexOf(a.id)
        })

        return packQuestions(
            questions.map((question) => ({ quizID, question })),
        )
    })
}

const getQuestion = async (
    quizID: string,
    questionID: string,
): Promise<QuestionModel> => {
    return QuizRepository.runTransaction(async (tran) => {
        const quiz = await tran.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(questionID)
        if (!question) {
            throw new NotFoundError()
        }
        return packQuestion({ quizID, question })
    })
}

const addQuestion = async (
    quizID: string,
    q: string,
    imageURI: string,
    topics: string,
): Promise<QuestionModel> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)

        const quiz = await QuizTranRepository.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = new Question()

        question.question = q
        question.imageURI = imageURI
        question.topics = topics
        question.answerID = ''

        const newQuestion = await quiz.questions.create(question)
        if (!newQuestion.options) {
            throw new NotFoundError()
        }

        const answer = new Option()
        answer.option = ''

        const newAnswer = await newQuestion.options.create(answer)

        newQuestion.answerID = newAnswer.id

        await quiz.questions.update(newQuestion)

        return packQuestion({ quizID, question: newQuestion })
    })
}

const editQuestion = async (
    quizID: string,
    id: string,
    q?: string,
    imageURI?: string,
    answer?: string,
    topics?: string,
): Promise<QuestionModel> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const quiz = await QuizTranRepository.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const question = await quiz.questions.findById(id)
        if (!question) {
            throw new NotFoundError()
        }

        question.question = q ? q : question.question
        question.imageURI = imageURI ? imageURI : question.imageURI
        question.topics = topics ? topics : question.topics
        question.modified = new Date()

        if (answer !== undefined && question.options) {
            const answerObj = await question.options.findById(question.answerID)

            if (answerObj === null) {
                throw new NotFoundError()
            }

            answerObj.option = answer
            await question.options.update(answerObj)
        }

        quiz.questions.update(question)

        return packQuestion({ quizID, question })
    })
}

const swapQuestion = async (
    quizID: string,
    oldID: string,
    newID: string,
): Promise<void> => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const quiz = await QuizTranRepository.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }

        const oldQuestion = await quiz.questions.findById(oldID)
        if (!oldQuestion) {
            throw new NotFoundError()
        }

        const oldQuestionOptions = await oldQuestion.options?.find()
        if (!oldQuestionOptions) {
            throw new NotFoundError()
        }

        const newQuestion = await quiz.questions.findById(newID)
        if (!newQuestion) {
            throw new NotFoundError()
        }

        const newQuestionOptions = await newQuestion.options?.find()
        if (!newQuestionOptions) {
            throw new NotFoundError()
        }
        await Promise.all(
            oldQuestionOptions.map(async (option) => {
                await oldQuestion.options?.delete(option.id)
            }),
        )

        await Promise.all(
            newQuestionOptions.map(async (option) => {
                await newQuestion.options?.delete(option.id)
            }),
        )
        await Promise.all(
            oldQuestionOptions.map(async (option) => {
                await newQuestion.options?.create(option)
            }),
        )
        await Promise.all(
            newQuestionOptions.map(async (option) => {
                await oldQuestion.options?.create(option)
            }),
        )
        const tempId = newQuestion.id
        newQuestion.id = oldQuestion.id

        await quiz.questions.delete(oldQuestion.id)
        await quiz.questions.create(newQuestion)

        oldQuestion.id = tempId
        await quiz.questions.delete(tempId)
        await quiz.questions.create(oldQuestion)
    })
}

const deleteQuestion = async (quizID: string, questionID: string) => {
    return runTransaction(async (tran) => {
        const QuizTranRepository = tran.getRepository(Quiz)
        const quiz = await QuizTranRepository.findById(quizID)
        if (!quiz || !quiz.questions) {
            throw new NotFoundError()
        }
        return quiz.questions.delete(questionID)
    })
}

export {
    getQuestions,
    getQuestion,
    addQuestion,
    editQuestion,
    swapQuestion,
    deleteQuestion,
}
