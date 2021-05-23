const studQuestion = {
    id: '123',
    question: 'What is the question?',
    numOfAnswers: 42,
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

const resolvers = {
    Query: {
        question(parents, args, ctx) {
            return studQuestion
        },
        questions(parents, args, ctx) {
            return [studQuestion, studQuestion, studQuestion]
        },
    },
}

export default resolvers
