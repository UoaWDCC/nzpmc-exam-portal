import { Quiz } from '../models'
import { Quiz as SchemaQuiz } from '@nzpmc-exam-portal/common'

const packQuiz = (quiz: Quiz): SchemaQuiz => {
    return {
        id: quiz.id,
        name: quiz.name,
        description: quiz.description,
        duration: quiz.duration,
        openTime: quiz.openTime,
        closeTime: quiz.closeTime,
        created: quiz.created,
        released: quiz.released,
        modified: quiz.modified,
    }
}

const packQuizzes = (quizzes: Quiz[]): SchemaQuiz[] => quizzes.map(packQuiz)

export { packQuiz, packQuizzes }
