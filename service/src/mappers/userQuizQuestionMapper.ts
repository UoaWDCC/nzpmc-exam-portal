import { Question, UserQuizQuestion } from '../models'
import { UserQuizQuestionModel } from '@nzpmc-exam-portal/common'

interface PackQuizQuestion {
    userQuizID: string
    quizQuestion: Question
    userQuizQuestion: UserQuizQuestion
}

const packUserQuizQuestion = ({
    userQuizID,
    quizQuestion,
    userQuizQuestion,
}: PackQuizQuestion): UserQuizQuestionModel => {
    return {
        userQuizID,
        id: quizQuestion.id,
        question: quizQuestion.question,
        imageURI: quizQuestion.imageURI,
        flag: !!userQuizQuestion.flag,
        firstViewed: userQuizQuestion.firstViewed,
        lastAnswered: userQuizQuestion.lastAnswered,
        created: quizQuestion.created,
        modified: quizQuestion.modified,
    }
}

const packUserQuizQuestions = (
    userQuizQuestions: PackQuizQuestion[],
): UserQuizQuestionModel[] => userQuizQuestions.map(packUserQuizQuestion)

export { packUserQuizQuestion, packUserQuizQuestions, PackQuizQuestion }
