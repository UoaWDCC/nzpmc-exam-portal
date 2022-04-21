import {
    getUser,
    addQuestion,
    addQuestionOption,
    getQuiz,
    addQuiz,
    addUser,
    addUserQuiz,
    editQuestionOption,
} from '../controllers'
import {
    addFirebaseUser,
    resetUserPasswordEmail,
    UserContext,
} from '../utils/firebase'
import {
    Maybe,
    MutationAddOptionArgs,
    MutationAddQuestionArgs,
    MutationAddQuizArgs,
    MutationAddUserArgs,
    MutationAddUserQuizArgs,
    MutationEditAnswerArgs,
    MutationResolvers,
    Option,
    Question,
    Quiz,
    RequireFields,
    Resolver,
    ResolverTypeWrapper,
    User,
    UserQuiz,
} from './resolvers-types'

const addOptionMutation: Resolver<
    Maybe<ResolverTypeWrapper<Option>>,
    {},
    UserContext,
    RequireFields<MutationAddOptionArgs, 'input'>
> = async (parents, { input }, context) => {
    const { quizID, questionID, option } = input

    return await addQuestionOption(quizID, questionID, option)
}

const addQuestionMutation: Resolver<
    Maybe<ResolverTypeWrapper<Question>>,
    {},
    UserContext,
    RequireFields<MutationAddQuestionArgs, 'input'>
> = async (parent, { input }, context) => {
    const { quizID, question, imageURI, numOfAnswers, topics } = input

    const quiz = await getQuiz(quizID)

    return await addQuestion(
        quiz,
        question,
        imageURI || '',
        numOfAnswers,
        topics,
    )
}

const addQuizMutation: Resolver<
    Maybe<ResolverTypeWrapper<Quiz>>,
    {},
    UserContext,
    RequireFields<MutationAddQuizArgs, 'input'>
> = async (parent, { input }, context) => {
    const { name, description, duration, numOfQuestions, startTime, endTime } =
        input

    return await addQuiz(
        name,
        description,
        duration,
        numOfQuestions,
        startTime,
        endTime,
    )
}

const addUserMutation: Resolver<
    Maybe<ResolverTypeWrapper<User>>,
    {},
    UserContext,
    RequireFields<MutationAddUserArgs, 'input'>
> = async (parent, { input }, context) => {
    const {
        displayName,
        email,
        photoURL,
        firstName,
        lastName,
        yearLevel,
        role,
        quizID,
    } = input

    const {
        uid: userID,
        displayName: firebaseDisplayName,
        photoURL: firebasePhotoURL,
    } = await addFirebaseUser(
        displayName || '',
        firstName,
        lastName,
        photoURL || '',
        email,
        '',
    )

    const user = await addUser(
        userID,
        firebaseDisplayName,
        email,
        firebasePhotoURL || '',
        firstName,
        lastName,
        yearLevel || '',
        role || '',
    )

    // Add UserQuiz if quizID is defined
    if (quizID) {
        const quiz = await getQuiz(quizID)
        await addUserQuiz(userID, quizID, quiz.startTime, quiz.endTime)
    }

    // Send reset password email
    await resetUserPasswordEmail(email)

    return user
}

const addUserQuizMutation: Resolver<
    Maybe<ResolverTypeWrapper<UserQuiz>>,
    {},
    any,
    RequireFields<MutationAddUserQuizArgs, 'input'>
> = async (parent, { input }, context) => {
    const { userID, quizID } = input

    const quiz = await getQuiz(quizID)

    return await addUserQuiz(userID, quizID, quiz.startTime, quiz.endTime)
}

const editAnswerMutation: Resolver<
    Maybe<ResolverTypeWrapper<Option>>,
    {},
    any,
    RequireFields<MutationEditAnswerArgs, 'input'>
> = async (parent, { input }, context) => {
    const { quizID, questionID, option } = input

    const quiz = await 

    return await editQuestionOption(quizID, questionID, option, option)
}

const editOptionMutation = async (parent, { input }, context) => {
    const { quizID, questionID, option, id } = input

    return await editQuestionOption(quizID, questionID, id, option)
}

const queryResolvers: MutationResolvers = {
    addOption: addOptionMutation,
    addQuestion: addQuestionMutation,
    addQuiz: addQuizMutation,
    addUser: addUserMutation,
    addUserQuiz: addUserQuizMutation,
    editAnswer: editAnswerMutation,
    // editOption:
    // editQuestion:
    // editQuiz:
    // editSelf:
    // editUser:
    // editUserQuiz:
    // editUserQuizQuestion:
    // image:
    // submitUserQuizQuestions:
}

export default queryResolvers
