import { Quiz, UserQuiz } from '../models'
import { UserQuizModel } from '../resolvers/custom/userQuizModel'

interface PackUserQuiz {
    userID: string
    quiz: Quiz
    userQuiz: UserQuiz
}

const packUserQuiz = ({
    userID,
    quiz,
    userQuiz,
}: PackUserQuiz): UserQuizModel => {
    return {
        userID,
        userQuizID: userQuiz.id,
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
