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
        userQuizID: userQuiz.id,
        expired,
        id: userQuiz.id,
        name: quiz.name,
        description: quiz.description,
        duration: quiz.duration,
        score: userQuiz.score ?? undefined,
        startTime: userQuiz.startTime,
        endTime: userQuiz.endTime,
        created: userQuiz.created,
        modified: userQuiz.modified,
    }
}

const packUserQuizzes = (packUserQuizzes: PackUserQuiz[]): UserQuizModel[] =>
    packUserQuizzes.map(packUserQuiz)

export { packUserQuiz, packUserQuizzes, PackUserQuiz }
