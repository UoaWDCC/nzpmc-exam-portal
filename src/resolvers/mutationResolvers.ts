import {
    addQuestion,
    addQuestionOption,
    getQuiz,
    addQuiz,
    addUser,
    addUserQuiz,
    editQuestionOption,
    getQuestion,
    editQuestion,
    editQuiz,
    editUser,
    editUserQuiz,
    editUserQuizQuestion,
    getUserQuiz,
    submitUserQuizQuestions,
    getUserAnswers,
} from '../controllers'
import {
    AdminAuthenticationError,
    AuthenticationError,
    NotFoundError,
} from '../utils/errors'
import {
    addFirebaseUser,
    bucket,
    resetUserPasswordEmail,
    UserContext,
} from '../utils/firebase'
import {
    Image,
    Maybe,
    MutationAddOptionArgs,
    MutationAddQuestionArgs,
    MutationAddQuizArgs,
    MutationAddUserArgs,
    MutationAddUserQuizArgs,
    MutationEditAnswerArgs,
    MutationEditOptionArgs,
    MutationEditQuestionArgs,
    MutationEditQuizArgs,
    MutationEditSelfArgs,
    MutationEditUserArgs,
    MutationEditUserQuizArgs,
    MutationEditUserQuizQuestionArgs,
    MutationImageArgs,
    MutationResolvers,
    MutationSubmitUserQuizQuestionsArgs,
    Option,
    Quiz,
    RequireFields,
    Resolver,
    ResolverTypeWrapper,
    User,
} from './resolvers-types'
import { admin, user } from './helpers/auth'
import { UserQuizQuestionModel } from './custom/userQuizQuestionModel'
import { QuestionModel } from './custom/questionModel'
import { UserQuizModel } from './custom/userQuizModel'

const addOptionMutation: Resolver<
    Maybe<ResolverTypeWrapper<Option>>,
    unknown,
    UserContext,
    RequireFields<MutationAddOptionArgs, 'input'>
> = async (_parents, { input }, _context) => {
    const { quizID, questionID, option } = input

    return await addQuestionOption(quizID, questionID, option)
}

const addQuestionMutation: Resolver<
    Maybe<ResolverTypeWrapper<QuestionModel>>,
    unknown,
    UserContext,
    RequireFields<MutationAddQuestionArgs, 'input'>
> = async (_parents, { input }, _context) => {
    const { quizID, question, imageURI, numOfAnswers, topics } = input

    return await addQuestion(
        quizID,
        question,
        imageURI || '',
        numOfAnswers,
        topics,
    )
}

const addQuizMutation: Resolver<
    Maybe<ResolverTypeWrapper<Omit<Quiz, 'question' | 'questions'>>>,
    unknown,
    UserContext,
    RequireFields<MutationAddQuizArgs, 'input'>
> = async (_parents, { input }, _context) => {
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
    unknown,
    UserContext,
    RequireFields<MutationAddUserArgs, 'input'>
> = async (_parent, { input }, _context) => {
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
    Maybe<ResolverTypeWrapper<UserQuizModel>>,
    unknown,
    UserContext,
    RequireFields<MutationAddUserQuizArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const { userID, quizID } = input

    const quiz = await getQuiz(quizID)

    return await addUserQuiz(userID, quizID, quiz.startTime, quiz.endTime)
}

const editAnswerMutation: Resolver<
    Maybe<ResolverTypeWrapper<Option>>,
    unknown,
    UserContext,
    RequireFields<MutationEditAnswerArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const { quizID, questionID, option } = input

    const question = await getQuestion(quizID, questionID)

    if (!question.answer) {
        throw new NotFoundError()
    }

    return await editQuestionOption(
        quizID,
        questionID,
        question.answer.id,
        option,
    )
}

const editOptionMutation: Resolver<
    Maybe<ResolverTypeWrapper<Option>>,
    unknown,
    UserContext,
    RequireFields<MutationEditOptionArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const { quizID, questionID, option, id } = input

    return await editQuestionOption(quizID, questionID, id, option)
}

const editQuestionMutation: Resolver<
    Maybe<ResolverTypeWrapper<QuestionModel>>,
    unknown,
    UserContext,
    RequireFields<MutationEditQuestionArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const { quizID, id, question, imageURI, numOfAnswers, topics } = input

    return await editQuestion(
        quizID,
        id,
        question || undefined,
        imageURI || undefined,
        numOfAnswers || undefined,
        '',
        topics || undefined,
    )
}

const editQuizMutation: Resolver<
    Maybe<ResolverTypeWrapper<Omit<Quiz, 'question' | 'questions'>>>,
    unknown,
    UserContext,
    RequireFields<MutationEditQuizArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const {
        id,
        name,
        description,
        duration,
        numOfQuestions,
        startTime,
        endTime,
    } = input

    return await editQuiz(
        id,
        name || undefined,
        description || undefined,
        duration || undefined,
        numOfQuestions || undefined,
        startTime || undefined,
        endTime || undefined,
    )
}

const editSelfMutation: Resolver<
    Maybe<ResolverTypeWrapper<User>>,
    unknown,
    UserContext,
    RequireFields<MutationEditSelfArgs, 'input'>
> = async (_parent, { input }, context) => {
    const { displayName, email, photoURL, firstName, lastName, yearLevel } =
        input

    if (!context.user) throw new AuthenticationError()

    const { userID } = context.user

    const user = await editUser(
        userID,
        displayName || undefined,
        email || undefined,
        photoURL || undefined,
        firstName || undefined,
        lastName || undefined,
        yearLevel || undefined,
        'Student',
    )

    return user
}

const editUserMutation: Resolver<
    Maybe<ResolverTypeWrapper<User>>,
    unknown,
    UserContext,
    RequireFields<MutationEditUserArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const { displayName, email, firstName, id, lastName, photoURL, yearLevel } =
        input

    const user = await editUser(
        id,
        displayName || undefined,
        email || undefined,
        photoURL || undefined,
        firstName || undefined,
        lastName || undefined,
        yearLevel || undefined,
        'Student',
    )

    return user
}

const editUserQuizMutation: Resolver<
    Maybe<ResolverTypeWrapper<UserQuizModel>>,
    unknown,
    UserContext,
    RequireFields<MutationEditUserQuizArgs, 'input'>
> = async (_parent, { input }, context) => {
    if (!context.user) throw new AuthenticationError()

    if (!context.user.admin) {
        // is not Admin
        const { userQuizID } = input
        let { startTime } = input

        if (startTime) {
            startTime = new Date().valueOf()
        }

        const userQuizObj = await getUserQuiz(userQuizID)
        if (userQuizObj.startTime) {
            // if startTime is already set need to be admin to change
            throw new AdminAuthenticationError()
        }

        return await editUserQuiz(userQuizID, undefined, startTime, undefined)
    }

    // is Admin
    const { userQuizID, score, startTime, endTime } = input

    const userQuiz = await editUserQuiz(
        userQuizID,
        score || undefined,
        startTime,
        endTime,
    )

    return userQuiz
}

const editUserQuizQuestionMutation: Resolver<
    Maybe<ResolverTypeWrapper<UserQuizQuestionModel>>,
    unknown,
    UserContext,
    RequireFields<MutationEditUserQuizQuestionArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const { answerID, flag, questionID, userQuizID } = input

    const userQuizQuestion = await editUserQuizQuestion(
        userQuizID,
        questionID,
        answerID || undefined,
        flag || undefined,
    )

    return userQuizQuestion
}

const imageMutation: Resolver<
    Maybe<ResolverTypeWrapper<Image>>,
    unknown,
    UserContext,
    RequireFields<MutationImageArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const { questionID, image } = input
    const { createReadStream, filename, mimetype } = await image
    const stream = createReadStream()

    const writeStream = bucket
        .file(`images/${questionID}/${filename}`)
        .createWriteStream({
            metadata: {
                contentType: mimetype,
            },
        })

    const pipedStreams = stream.pipe(writeStream)

    const result = new Promise<Image>((resolve, reject) => {
        pipedStreams.on('finish', () => {
            resolve({
                imageURI: `${process.env.BACKEND_URL}images/${questionID}/${filename}`,
            })
        })

        pipedStreams.on('error', (err: Error) => {
            console.log(err)
            reject(err)
        })
    })
    return result
}

const submitUserQuizQuestionsMutation: Resolver<
    Maybe<ResolverTypeWrapper<UserQuizModel>>,
    unknown,
    unknown,
    RequireFields<MutationSubmitUserQuizQuestionsArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const { userQuizID } = input

    const userQuiz = await getUserQuiz(userQuizID)

    // endtime doesn't exist means quiz hasn't started
    if (!userQuiz.endTime) {
        throw new AuthenticationError()
    }

    // ensure quiz cannot be submitted if currenttime is after the quiz endtime with 60s leeway
    if (new Date().getTime() > userQuiz.endTime.getTime() + 60000) {
        throw new AuthenticationError()
    }

    const { userAnswerIDs, correctAnswerIDs } = await getUserAnswers(userQuizID)

    // update UserQuiz
    return await submitUserQuizQuestions(
        userQuizID,
        userAnswerIDs,
        correctAnswerIDs,
    )
}

const mutationResolvers: MutationResolvers = {
    addOption: admin(addOptionMutation),
    addQuestion: admin(addQuestionMutation),
    addQuiz: admin(addQuizMutation),
    addUser: admin(addUserMutation),
    addUserQuiz: admin(addUserQuizMutation),
    editAnswer: admin(editAnswerMutation),
    editOption: admin(editOptionMutation),
    editQuestion: admin(editQuestionMutation),
    editQuiz: admin(editQuizMutation),
    editSelf: user(editSelfMutation),
    editUser: admin(editUserMutation),
    editUserQuiz: user(editUserQuizMutation),
    editUserQuizQuestion: admin(editUserQuizQuestionMutation),
    image: admin(imageMutation),
    submitUserQuizQuestions: user(submitUserQuizQuestionsMutation),
}

export default mutationResolvers
