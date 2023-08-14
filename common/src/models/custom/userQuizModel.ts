export type UserQuizModel = {
    userID: string
    quizID: string
    expired: boolean
    id: string
    name: string
    description: string
    duration: number
    score?: number
    submitted?: boolean
    startTime?: Date
    endTime?: Date
    created: Date
    modified: Date
}
