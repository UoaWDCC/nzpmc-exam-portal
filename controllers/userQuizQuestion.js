import { Option, Question, Quiz, UserQuizQuestion } from '../models'
import { packOptions } from './option'
import { getUserQuiz, setUserQuizScore } from './userQuiz'

const getUserQuizQuestion = async (userQuiz, id) => {
    const quiz = await userQuiz.quizObj.get()

    const quizQuestion = await Question.collection.get({
        key: quiz.key + '/Question/' + id,
    })

    if (!quizQuestion.flag) {
        quizQuestion.flag = false
    }

    const userQuizQuestion = await UserQuizQuestion.collection.get({
        key: userQuiz.key + '/UserQuizQuestion/' + id,
    })

    return {
        id: quizQuestion.id,
        question: quizQuestion.question,
        imageURI: quizQuestion.imageURI,
        flag: !!quizQuestion.flag,
        questionKey: quizQuestion.key,
        questionObj: quizQuestion,
        userAnswerKey: userQuizQuestion ? userQuizQuestion.key : null,
        userAnswerObj: userQuizQuestion,
    }
}

const getUserQuizQuestions = async (userQuiz) => {
    const quiz = await userQuiz.quizObj.get()
    const quizQuestions = (await Question.collection.parent(quiz.key).fetch())
        .list

    const userQuizQuestions = (
        await UserQuizQuestion.collection.parent(userQuiz.key).fetch()
    ).list

    const userQuizQuestionsMap = userQuizQuestions.reduce((map, question) => {
        map[question.id] = question

        return map
    }, {})

    return quizQuestions.map((quizQuestion) => {
        let userQuizQuestion = userQuizQuestionsMap[quizQuestion.id]
        if (!userQuizQuestion) {
            return {
                id: quizQuestion.id,
                question: quizQuestion.question,
                imageURI: quizQuestion.imageURI,
                questionKey: quizQuestion.key,
                questionObj: quizQuestion,
            }
        }
        return {
            id: quizQuestion.id,
            question: quizQuestion.question,
            imageURI: quizQuestion.imageURI,
            questionKey: quizQuestion.key,
            questionObj: quizQuestion,
            userAnswerKey: userQuizQuestion.key,
            userAnswerObj: userQuizQuestion,
        }
    })
}

const addUserQuizQuestion = async (userQuiz, question) => {
    const userQuizQuestion = UserQuizQuestion.init({ parent: userQuiz.key })

    userQuizQuestion.id = question.id
    userQuizQuestion.question = question.key
    userQuizQuestion.answer = null
    userQuizQuestion.firstViewed = null
    userQuizQuestion.lastAnswered = null

    await UserQuizQuestion.save()

    return await getUserQuizQuestion(UserQuizQuestion.id)
}

const editUserQuizQuestion = async (userQuiz, id, answer) => {
    const userQuizQuestion = UserQuizQuestion.init({ parent: userQuiz.key })

    userQuizQuestion.id = id

    if (answerKey == '' && !userQuizQuestion.answer) {
        userQuizQuestion.answer = null
    } else if (!answerKey && userQuizQuestion.answer) {
        userQuizQuestion.answer = userQuizQuestion.answer
    } else {
        userQuizQuestion.answer = answerKey
    }

    userQuizQuestion.flag = flag ? flag : !!userQuizQuestion.flag
    userQuizQuestion.firstViewed = userQuizQuestion.firstViewed
        ? userQuizQuestion.firstViewed
        : new Date()
    userQuizQuestion.lastAnswered = answer
        ? new Date()
        : userQuizQuestion.lastAnswered
    userQuizQuestion.modified = new Date()

    await userQuizQuestion.upsert()

    return answer
}

const getUserQuizQuestionOptions = async (quizQuestion) => {
    const userQuizQuestion = await UserQuizQuestion.collection.get({
        key: quizQuestion.key,
    })

    const question = await userQuizQuestion.question.get()

    return await getUserQuizQuestionOptionsByQuestion(question)
}

const getUserQuizQuestionOptionsByQuestion = async (question) => {
    const options = (await Option.collection.parent(question.key).fetch()).list

    let answers
    if (!question.answer || !question.answer.ref) {
        answers = options
    } else {
        const answer = await question.answer.get()
        answers = [answer, ...options]
    }

    let count = answers.length,
        randomnumber,
        temp
    while (count) {
        randomnumber = (Math.random() * count--) | 0
        temp = answers[count]
        answers[count] = answers[randomnumber]
        answers[randomnumber] = temp
    }

    return packOptions(answers)
}

const getUserAnswerIDs = async (userQuiz) => {
    const userAnswers = await getUserQuizQuestions(userQuiz)

    const userAnswerIDs = await Promise.all(userAnswers.map(async (userAnswer) => {
        const answer = await userAnswer.userAnswerObj.answer.get() 
        return answer.id
    }))

    return userAnswerIDs
}

const submitUserQuizQuestions = async (userQuizID, userAnswers, correctAnswers) => {
    // calculate score starting at index 0
    const calculatedScore = userAnswers.reduce((score, userAnswer, index) => {
        return (userAnswer === correctAnswers[index] ? score + 1 : score)
    }, 0)

    // update userQuiz 
    await setUserQuizScore(userQuizID, calculatedScore)

    return getUserQuiz(userQuizID) 
}

export {
    getUserQuizQuestion,
    getUserQuizQuestions,
    addUserQuizQuestion,
    editUserQuizQuestion,
    getUserQuizQuestionOptions,
    getUserQuizQuestionOptionsByQuestion,
    submitUserQuizQuestions,
    getUserAnswerIDs,
}
