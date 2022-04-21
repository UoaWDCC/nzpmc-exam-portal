import { Question, UserQuizQuestion } from '../models'
import { UserQuizQuestion as SchemaUserQuizQuestion } from '../resolvers/resolvers-types'

interface PackQuizQuestion {
    quizQuestion: Question
    userQuizQuestion: UserQuizQuestion
}

const packUserQuizQuestion = ({
    quizQuestion,
    userQuizQuestion,
}: PackQuizQuestion): SchemaUserQuizQuestion => {
    return {
        id: quizQuestion.id,
        question: quizQuestion.question,
        imageURI: quizQuestion.imageURI,
        flag: !!userQuizQuestion.flag,
        firstViewed: userQuizQuestion.firstViewed,
        lastAnswered: userQuizQuestion.lastAnswered,
        options: [], //TODO
        created: quizQuestion.created,
        modified: quizQuestion.modified,
    }
}

const packUserQuizQuestions = (
    userQuizQuestions: PackQuizQuestion[],
): SchemaUserQuizQuestion[] => userQuizQuestions.map(packUserQuizQuestion)

export { packUserQuizQuestion, packUserQuizQuestions, PackQuizQuestion }
