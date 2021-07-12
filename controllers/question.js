import { Question, Option } from '../models'

const packQuestion = (question) => {
    return {
        key: question.key,
        id: question.id,
        question: question.question,
        imageURI: question.imageURI,
        numOfAnswer: question.numOfAnswer,
        answerObj: question.answer,
        topics: question.topics,
        correct: question.correct,
        option: question.option,
        created: question.created,
        modified: question.modified,
        deleted: question.deleted,
    }
}

const packQuestions = (questions) => questions.map(packQuestion)

const getQuestions = async (quiz) => {
    const question = (await Question.collection.parent(quiz.key).fetch()).list
    return packQuestions(question)
}

const getQuestion = async (quiz, questionID) => {
    const question = await Question.collection.get({key: quiz.key+"/Question/"+questionID})

    return packQuestion(question)
}

const addQuestion = async (quiz, q, imageURI, numOfAnswers, topics) => {
    const question = Question.init({ parent: quiz.key })

    question.question = q
    question.imageURI = imageURI
    question.numOfAnswer = numOfAnswers
    question.topics = topics
    question.created = new Date()
    question.modified = new Date()

    const answer = Answer.init()
    answer.option = ""
    question.answer = answer.key

    await question.save()

    return packQuestion(question)
}

const editQuestion = async (quiz, id, q, imageURI, numOfAnswers, answer, topics) => {
    const question = await Question.collection.get({key: quiz.key+"/Question/"+id})

    question.question = q ? q : question.question
    question.imageURI = imageURI ? imageURI : question.imageURI
    question.numOfAnswers = numOfAnswers ? numOfAnswers : question.numOfAnswers
    question.topics = topics ? topics : question.topics
    question.modified = new Date()
    question.created = question.created.toDate()
    question.answer = answer ? answer : (await question.answer.get()).key

    await question.update()

    return packQuestion(question)
}

export { getQuestions, getQuestion, addQuestion, editQuestion }
