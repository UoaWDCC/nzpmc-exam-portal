const studQuiz = {
    id: '123',
    question: 'What is the question?',
    noAnswers: 42,
    topics: 'Physics, Existentialism',
    options: [
        {
            id: '123',
            option: 'Option1',
            created: new Date(),
            modified: new Date(),
        },
        {
            id: '124',
            option: 'Option2',
            created: new Date(),
            modified: new Date(),
        },
    ],
    created: new Date(),
    modified: new Date(),
}

const studUser = {
    id: '123',
    displayName: 'user',
    email: 'user@email.com',
    emailVerified: 'user@email.com',
    photoURL: 'https://i.imgur.com/G4cy8en.jpg',
    firstName: 'Joe',
    lastName: 'Smith',
    yearLevel: 9,
    role: 'student',
    created: Date.now(),
    modified: Date.now(),
}

const studQuestion = {
    id: '123',
    question: 'What is the question?',
    noAnswers: 42,
    topics: 'Physics, Existentialism',
    options: [
        {
            id: '123',
            option: 'Option1',
            created: new Date(),
            modified: new Date(),
        },
        {
            id: '124',
            option: 'Option2',
            created: new Date(),
            modified: new Date(),
        },
    ],
    created: new Date(),
    modified: new Date(),
}
const studUserQuizAnswer = {
    id: '123',
    question: studQuestion,
    answer: {
        id: '123',
        option: 'Option1',
        created: new Date(),
        modified: new Date(),
    },
    startTime: new Date(),
    endTime: new Date(),
    created: new Date(),
    modified: new Date(),
}

const studUserQuiz = {
    id: '123',
    user: studUser,
    answer: studUserQuizAnswer,
    answers: [studUserQuizAnswer, studUserQuizAnswer],
    score: 6.9,
    startTime: new Date(),
    endTime: new Date(),
    created: new Date(),
    modified: new Date(),
}

const resolvers = {
    Query: {
        quizzes(parents, args, ctx) {
            return [studQuiz, studQuiz]
        },
        userQuizzes(parents, args, ctx) {
            return [studUserQuiz, studUserQuiz]
        },
        userQuiz(parents, args, ctx) {
            return studUserQuiz
        },
    },
}

export default resolvers
