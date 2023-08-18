import {
    addQuestion,
    addQuestionOption,
    getQuiz,
    addQuiz,
    addUser,
    addUserQuiz,
    editQuestionOption,
    deleteQuestionOption,
    deleteUser,
    getQuestion,
    editQuestion,
    editQuiz,
    editUser,
    editUserQuiz,
    editUserQuizQuestion,
    getUserQuiz,
    submitUserQuizQuestions,
    getUserAnswers,
    deleteQuestion,
    deleteQuiz,
    swapQuestion,
    getOptionByID,
    getUser,
} from '../controllers'
import {
    AdminAuthenticationError,
    AuthenticationError,
    NotFoundError,
} from '../utils/errors'
import { addFirebaseUser, bucket, UserContext } from '../utils/firebase'
import {
    Image,
    Maybe,
    MutationAddOptionArgs,
    MutationAddQuestionArgs,
    MutationAddQuizArgs,
    MutationAddUserArgs,
    MutationAddUserQuizArgs,
    MutationDeleteUserArgs,
    MutationDeleteQuestionArgs,
    MutationDeleteQuizArgs,
    MutationDeleteOptionArgs,
    MutationEditAnswerArgs,
    MutationEditOptionArgs,
    MutationEditOrderQuestionArgs,
    MutationEditQuestionArgs,
    MutationEditQuizArgs,
    MutationEditSelfArgs,
    MutationEditUserArgs,
    MutationEditUserQuizArgs,
    MutationEditUserQuizQuestionArgs,
    MutationImageArgs,
    MutationResolvers,
    MutationSubmitUserQuizQuestionsArgs,
    MutationEnrolUsersInQuizArgs,
    MutationSwapQuestionArgs,
    Option,
    Quiz,
    RequireFields,
    Resolver,
    ResolverTypeWrapper,
    User,
    UserQuizQuestionModel,
    QuestionModel,
    UserQuizModel,
    MutationUnenrolUsersFromQuizArgs,
} from '@nzpmc-exam-portal/common'
import { admin, user } from './helpers/auth'
import { deleteUserQuiz } from '../controllers/userQuiz'

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
    const { quizID, question, imageURI, topics } = input

    return await addQuestion(quizID, question, imageURI || '', topics)
}

const addQuizMutation: Resolver<
    Maybe<ResolverTypeWrapper<Omit<Quiz, 'question' | 'questions'>>>,
    unknown,
    UserContext,
    RequireFields<MutationAddQuizArgs, 'input'>
> = async (_parents, { input }, _context) => {
    const { name, description, duration, startTime, endTime } = input

    return await addQuiz(name, description, duration, startTime, endTime)
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
        photoURL ? photoURL : '',
        email,
        '',
    )
    console.log(userID)

    // Add UserQuiz if quizID is defined
    if (quizID) {
        const quiz = await getQuiz(quizID)
        await addUserQuiz(userID, quizID, quiz.startTime, quiz.endTime)
    }

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

    // Send reset password email
    //await resetUserPasswordEmail(email)
    console.log(user)

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

    if (!question.answerID) {
        throw new NotFoundError()
    }

    return await editQuestionOption(
        quizID,
        questionID,
        question.answerID,
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

const deleteOptionMutation: Resolver<
    Maybe<ResolverTypeWrapper<Option>>,
    unknown,
    UserContext,
    RequireFields<MutationDeleteOptionArgs, 'quizID' | 'id' | 'optionID'>
> = async (_parent, { quizID, id, optionID }, _context) => {
    const option = await getOptionByID(quizID, id, optionID)
    deleteQuestionOption(quizID, id, optionID)
    return option
}

const editQuestionMutation: Resolver<
    Maybe<ResolverTypeWrapper<QuestionModel>>,
    unknown,
    UserContext,
    RequireFields<MutationEditQuestionArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const { quizID, id, question, imageURI, topics } = input

    return await editQuestion(
        quizID,
        id,
        question || undefined,
        imageURI || undefined,
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
    const { id, name, description, duration, startTime, endTime } = input

    return await editQuiz(
        id,
        name || undefined,
        description || undefined,
        duration || undefined,
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

const deleteUserMutation: Resolver<
    Maybe<ResolverTypeWrapper<User>>,
    unknown,
    UserContext,
    Partial<MutationDeleteUserArgs>
> = async (_parent, { id, email }, _context) => {
    const user = await deleteUser(id, email)

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
    const { userQuizID, quizStart, score, startTime, endTime } = input

    const userQuiz = await editUserQuiz(
        userQuizID,
        quizStart || undefined,
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
        flag ?? undefined,
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
    // flag quiz as submitted
    editUserQuiz(userQuizID, undefined, undefined, undefined, undefined, true)

    const { userAnswerIDs, correctAnswerIDs } = await getUserAnswers(userQuizID)

    // update UserQuiz
    return await submitUserQuizQuestions(
        userQuizID,
        userAnswerIDs,
        correctAnswerIDs,
    )
}

const deleteQuestionMutation: Resolver<
    Maybe<ResolverTypeWrapper<QuestionModel>>,
    unknown,
    UserContext,
    RequireFields<MutationDeleteQuestionArgs, 'quizID' | 'id'>
> = async (_parent, { quizID, id }, _context) => {
    const question = await getQuestion(quizID, id)
    deleteQuestion(quizID, id)
    return question
}

const deleteQuizMutation: Resolver<
    Maybe<ResolverTypeWrapper<Omit<Quiz, 'question' | 'questions'>>>,
    unknown,
    UserContext,
    RequireFields<MutationDeleteQuizArgs, 'id'>
> = async (_parent, { id }, _context) => {
    const quiz = await getQuiz(id)
    deleteQuiz(id)
    return quiz
}

const swapQuestionMutation: Resolver<
    Maybe<ResolverTypeWrapper<Omit<Quiz, 'question' | 'questions'>>>,
    unknown,
    UserContext,
    RequireFields<MutationSwapQuestionArgs, 'newID' | 'oldID' | 'quizID'>
> = async (_parent, { newID, oldID, quizID }, _context) => {
    await swapQuestion(quizID, oldID, newID)

    const quiz = await getQuiz(quizID)
    return quiz
}

const editOrderQuestionMutation: Resolver<
    Maybe<ResolverTypeWrapper<Omit<Quiz, 'question' | 'questions'>>>,
    unknown,
    UserContext,
    RequireFields<MutationEditOrderQuestionArgs, 'input'>
> = async (_parent, { input }, _context) => {
    const { questionIDs, quizID } = input
    const quiz = await editQuiz(
        quizID,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        questionIDs,
    )
    return quiz
}

const enrolUsersInQuizMutation: Resolver<
    Array<ResolverTypeWrapper<UserQuizModel>>,
    unknown,
    UserContext,
    RequireFields<MutationEnrolUsersInQuizArgs, 'users' | 'quizID'>
> = async (_parent, { users, quizID }, _context) => {
    const quizToEnrol = quizID
    console.log(users)
    const quiz = await getQuiz(quizToEnrol)

    // Use `map` to create an array of Promises representing the addUserQuiz() operations
    const addUserQuizPromises = users.map(async (currentUser) => {
        const userID = currentUser.id
        const userEmail = currentUser.email
        try {
            const user = await getUser(userID, userEmail)
            console.log(user)
        } catch (e) {
            console.error(e)
            console.error('User does not exist')
            // TODO: create the user etc
            return null
        }

        // TODO: enrol user
        const newUserQuiz = await addUserQuiz(
            userID,
            quizToEnrol,
            quiz.startTime,
            quiz.endTime,
        )

        return newUserQuiz
    })

    const resolvedQuizzes = await Promise.all(addUserQuizPromises)
    const newQuizzes: UserQuizModel[] = []

    resolvedQuizzes.map((addedQuiz) => {
        if (addedQuiz) {
            newQuizzes.push(addedQuiz)
        }
    })

    return newQuizzes
}

const unenrolUsersFromQuizMutation: Resolver<
    Array<ResolverTypeWrapper<string>>,
    unknown,
    UserContext,
    RequireFields<MutationUnenrolUsersFromQuizArgs, 'quizID' | 'users'>
> = async (_parent, { users, quizID }, _context) => {
    const quizToUnenrolFrom = quizID

    const deletedUserQuizIDs: string[] = []
    // Use `map` to create an array of Promises representing the addUserQuiz() operations
    const addUserQuizPromises = users.map(async (currentUser) => {
        const userID = currentUser.id
        const userEmail = currentUser.email
        const deletedQuizID = await deleteUserQuiz(quizToUnenrolFrom, userID)
        if (deletedQuizID !== null) {
            deletedUserQuizIDs.push(deletedQuizID)
        }
    })

    // Wait for all the promises to resolve
    await Promise.all(addUserQuizPromises)

    return deletedUserQuizIDs
}

const mutationResolvers: MutationResolvers = {
    addOption: admin(addOptionMutation),
    addQuestion: admin(addQuestionMutation),
    addQuiz: admin(addQuizMutation),
    addUser: admin(addUserMutation),
    addUserQuiz: admin(addUserQuizMutation),
    deleteQuestion: admin(deleteQuestionMutation),
    deleteQuiz: admin(deleteQuizMutation),
    deleteOption: admin(deleteOptionMutation),
    deleteUser: admin(deleteUserMutation),
    editAnswer: admin(editAnswerMutation),
    editOption: admin(editOptionMutation),
    editOrderQuestion: admin(editOrderQuestionMutation),
    editQuestion: admin(editQuestionMutation),
    editQuiz: admin(editQuizMutation),
    editSelf: user(editSelfMutation),
    editUser: admin(editUserMutation),
    editUserQuiz: user(editUserQuizMutation),
    editUserQuizQuestion: admin(editUserQuizQuestionMutation),
    enrolUsersInQuiz: admin(enrolUsersInQuizMutation),
    unenrolUsersFromQuiz: admin(unenrolUsersFromQuizMutation),
    image: admin(imageMutation),
    submitUserQuizQuestions: user(submitUserQuizQuestionsMutation),
    swapQuestion: admin(swapQuestionMutation),
}

export default mutationResolvers
