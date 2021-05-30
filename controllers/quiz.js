import { Fireo } from 'fireo'
import { UserQuiz, Quiz } from '../models'

const packQuiz = (quiz) => {
    return {
        key: quiz.key,
        id: quiz.id,
        description: quiz.description,
        duration: quiz.duration,
        numOfQuestions: quiz.numOfQuestions,
        questions: quiz.questions,
        startTime: quiz.startTime,
        endTime: quiz.endTime,
        created: quiz.created,
        modified: quiz.modified,
    }
}

const packUserQuiz = (userquiz) => {
    return {
        key: userquiz.key,
        id: userquiz.id,
        quiz: userquiz.quiz,
        answers: userquiz.quiz,
        score: userquiz.quiz,
        startTime: userquiz.startTime,
        endTime: userquiz.endTime,
        created: userquiz.created,
        modified: userquiz.modified,
    }
}

const packQuizzes= (quizzes) => quizzes.map(packQuiz)

const packUserQuizzes= (quizzes) => quizzes.map(packUserQuiz)


const getUserQuiz = async (id) => {
    const quiz = await UserQuiz.collection.get({ id })
    return packUserQuiz(quiz);
}

const getAllQuizzes = async () => {
    const quizzes = (
        await Quiz.collection.fetch()
    ).list
    return packQuizzes(quizzes);
}

const getAllUserQuizzes = async () => {
    const userQuizzes = (
        await UserQuiz.collection.fetch()
    ).list
    return packUserQuizzes(userQuizzes);
}

export {getUserQuiz, getAllQuizzes, getAllUserQuizzes}