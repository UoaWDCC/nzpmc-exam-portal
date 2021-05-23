import {
    Option,
    Question,
    Quiz,
    User,
    UserQuiz,
    UserQuizAnswer,
} from '../models/'

const createOption = async (data) => {
    let option = Option.init()
    option.id = data.id
    option.option = data.option
    option.created = new Date()
    option.modified = new Date()
    await option.save()
}

const createQuestion = async (data) => {
    let question = Question.init()
    question.id = data.id
    question.question = data.question
    question.numOfAnswers = data.numOfAnswers
    question.topics = data.topics
    question.created = new Date()
    question.modified = new Date()
    await question.save()
}

const createUser = async (data) => {
    let user = User.init()
    user.id = data.id
    user.displayName = data.displayName
    user.email = data.email
    user.emailVerified = data.emailVerified
    user.photoURL = data.photoURL
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.yearLevel = data.yearLevel
    user.role = data.role
    user.created = Date.now()
    user.modified = Date.now()
    await user.save()
}

const createQuiz = async (data) => {
    let quiz = Quiz.init()
    quiz.id = data.id
    quiz.question = data.question
    quiz.numOfAnswers = data.numOfAnswers
    quiz.topics = data.topics
    quiz.created = new Date()
    quiz.modified = new Date()
    await quiz.save()
}

const createUserQuiz = async (data) => {
    let userQuiz = UserQuiz.init()
    userQuiz.id = data.id
    userQuiz.question = data.question
    userQuiz.numOfAnswers = data.numOfAnswers
    userQuiz.topics = data.topics
    userQuiz.created = new Date()
    userQuiz.modified = new Date()
    await userQuiz.save()
}

const createUserQuizAnswer = async (data) => {
    let userQuizAnswer = UserQuizAnswer.init()
    userQuizAnswer.id = data.id
    userQuizAnswer.question = data.question
    userQuizAnswer.numOfAnswers = data.numOfAnswers
    userQuizAnswer.topics = data.topics
    userQuizAnswer.created = new Date()
    userQuizAnswer.modified = new Date()
    await userQuizAnswer.save()
}

const loadStud = () => {
    createUser({
        id: '1',
        displayName: 'user',
        email: 'user@email.com',
        emailVerified: 'user@email.com',
        photoURL: 'https://i.imgur.com/G4cy8en.jpg',
        firstName: 'Joe',
        lastName: 'Smith',
        yearLevel: 9,
        role: 'student',
    })
    createQuiz({
        id: '1',
        question: 'What is the question?',
        numOfAnswers: 42,
        topics: 'Physics, Existentialism',
    })
}

export { loadStud }
