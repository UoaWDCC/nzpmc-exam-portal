import {
    Option,
    Question,
    Quiz,
    User,
    UserQuiz,
    UserQuizQuestion,
} from './models/'
import dotenv from 'dotenv'

dotenv.config()

const createOption = async (data) => {
    let option = Option.init()
    option.id = data.id
    option.option = data.option
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
    user.created = new Date()
    user.modified = new Date()
    await user.save()
}

const createQuiz = async (data) => {
    let quiz = Quiz.init()
    quiz.id = data.id
    quiz.name = data.name
    quiz.description = data.description
    quiz.duration = data.duration
    quiz.numOfQuestions = data.numOfQuestions
    quiz.questions = data.questions
    quiz.startTime = data.startTime
    quiz.endTime = data.endTime
    quiz.created = new Date()
    quiz.modified = new Date()
    await quiz.save()
}

const createUserQuiz = async (data) => {
    let userQuiz = UserQuiz.init()
    userQuiz.id = data.id
    userQuiz.user = data.user
    userQuiz.quiz = data.quiz
    userQuiz.score = data.score
    userQuiz.startTime = data.startTime
    userQuiz.endTime = data.endTime
    userQuiz.created = new Date()
    userQuiz.modified = new Date()
    await userQuiz.save()
}

const createUserQuizQuestion = async (data) => {
    let UserQuizQuestion = UserQuizQuestion.init()
    UserQuizQuestion.id = data.id
    UserQuizQuestion.question = data.question
    UserQuizQuestion.answer = data.answer
    UserQuizQuestion.firstViewed = data.firstViewed
    UserQuizQuestion.lastAnswered = data.lastAnswered
    UserQuizQuestion.created = new Date()
    UserQuizQuestion.modified = new Date()
    await UserQuizQuestion.save()
}

const loadStud = async () => {
    await createUser({
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
    await createQuiz({
        id: '1',
        name: 'Example Quiz',
        description: 'Example description',
        duration: 86400,
        numOfQuestions: 2,
        questions: ['Question/1', 'Question/2'],
        startTime: new Date(),
        endTime: new Date(),
    })
    await createOption({
        id: '1',
        option: 'Option1',
    })
    await createOption({
        id: '2',
        option: 'Option2',
    })
    await createQuestion({
        id: '1',
        question: 'What is the question?',
        numOfAnswers: 42,
        topics: 'Physics, Existentialism',
    })
    await createUserQuizQuestion({
        id: '1',
        question: 'Question/1',
        answer: 'Option/1',
        startTime: new Date(),
        endTime: new Date(),
    })
}

export { loadStud }

loadStud()
