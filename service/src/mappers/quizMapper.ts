import { Quiz } from '../models'
import { Quiz as SchemaQuiz } from '@nzpmc-exam-portal/common'

const packQuiz = (quiz: Quiz): SchemaQuiz => {
    return {
        id: quiz.id,
        name: quiz.name,
        description: quiz.description,
        duration: quiz.duration,
        startTime: quiz.startTime,
        endTime: quiz.endTime,
        created: quiz.created,
        modified: quiz.modified,
    }
}

const packQuizzes = (quizzes: Quiz[]): SchemaQuiz[] => quizzes.map(packQuiz)

export { packQuiz, packQuizzes }
