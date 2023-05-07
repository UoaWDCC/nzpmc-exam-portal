class UserQuizQuestion {
    id!: string

    questionID!: string

    answerID: string | null = null

    flag = false
    firstViewed: Date | null = null
    lastAnswered: Date | null = null

    created: Date = new Date()
    modified: Date = new Date()
    deleted: Date | null = null
}

export default UserQuizQuestion
