import { Quiz, UserQuiz } from '../models'
import { UserQuiz as SchemaUserQuiz } from '../resolvers/resolvers-types'

interface PackUserQuiz {
    quiz: Quiz
    userQuiz: UserQuiz
}

const packUserQuiz = ({ quiz, userQuiz }: PackUserQuiz): SchemaUserQuiz => {
    return {
        id: userQuiz.id,
        name: quiz.name,
        description: quiz.description,
        duration: quiz.duration,
        score: userQuiz.score,
        startTime: userQuiz.startTime,
        endTime: userQuiz.endTime,
        created: userQuiz.created,
        modified: userQuiz.modified,
    }
}

const packUserQuizzes = (packUserQuizzes: PackUserQuiz[]): SchemaUserQuiz[] =>
    packUserQuizzes.map(packUserQuiz)

export { packUserQuiz, packUserQuizzes, PackUserQuiz }
