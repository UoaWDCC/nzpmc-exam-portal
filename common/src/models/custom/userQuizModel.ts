export type UserQuizModel = {
    userID: string
    quizID: string
    expired: boolean
    id: string
    name: string
    description: string
    duration: number
    quizStart?: number
    score?: number
    startTime?: Date
    endTime?: Date
    created: Date
    modified: Date
}
