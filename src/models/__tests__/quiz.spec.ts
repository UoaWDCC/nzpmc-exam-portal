import { getRepository } from 'fireorm'
import Quiz from '../quiz'
import '../../../test/fireorm'

describe('Quiz', () => {
    const QuizRepository = getRepository(Quiz)
    it('can be created', async () => {
        const quiz = new Quiz()
        quiz.name = 'example quiz'
        quiz.description = 'example description'
        quiz.duration = 60
        quiz.numOfQuestions = 10
        quiz.startTime = new Date()
        quiz.endTime = new Date()

        const quizDocument = await QuizRepository.create(quiz)
        const readQuizDocument = await QuizRepository.findById(quizDocument.id)

        expect(readQuizDocument.description).toEqual(quiz.description)
    })

    it('can be updated', async () => {
        const quiz = new Quiz()
        quiz.name = 'example quiz'
        quiz.description = 'example description'
        quiz.duration = 60
        quiz.numOfQuestions = 10
        quiz.startTime = new Date()
        quiz.endTime = new Date()

        const quizDocument = await QuizRepository.create(quiz)

        quizDocument.description = 'updated'

        await QuizRepository.update(quizDocument)

        const readQuizDocument = await QuizRepository.findById(quizDocument.id)

        expect(readQuizDocument.description).toEqual(quizDocument.description)
    })
})
