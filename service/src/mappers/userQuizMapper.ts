import { Quiz, UserQuiz } from '../models'
import { UserQuizModel } from '@nzpmc-exam-portal/common'

interface PackUserQuiz {
    userID: string
    quiz: Quiz
    userQuiz: UserQuiz
    expired: boolean
}

const packUserQuiz = ({
    userID,
    quiz,
    userQuiz,
    expired,
}: PackUserQuiz): UserQuizModel => {
    return {
        userID,
        expired,
        quizStart: userQuiz.quizStart ?? undefined,
        id: userQuiz.id,
        name: quiz.name,
        quizID: userQuiz.quizID,
        description: quiz.description,
        duration: quiz.duration,
        score: userQuiz.score ?? undefined,
        submitted: userQuiz.submitted,
        openTime: userQuiz.openTime,
        closeTime: userQuiz.closeTime,
        created: userQuiz.created,
        modified: userQuiz.modified,
    }
}

const packUserQuizzes = (packUserQuizzes: PackUserQuiz[]): UserQuizModel[] =>
    packUserQuizzes.map(packUserQuiz)

export { packUserQuiz, packUserQuizzes, PackUserQuiz }
