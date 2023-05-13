export type UserQuizModel = {
    userID: string
    userQuizID: string
    expired: boolean
    id: string
    name: string
    description: string
    duration: number
    score?: number
    startTime?: Date
    endTime?: Date
    created: Date
    modified: Date
}
