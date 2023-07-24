import {
    getAllQuizzes,
    getQuiz,
    getUser,
    getUserQuiz,
    getUserQuizbyQuizID,
    getUserQuizzesByQuizID,
    getUserQuizzes,
    getUsersPagination,
} from '../controllers'
import { AuthenticationError } from '../utils/errors'
import { bucket, UserContext } from '../utils/firebase'
import { admin, user } from './helpers/auth'
import {
    UserQuizModel,
    Image,
    QueryImageArgs,
    QueryQuizArgs,
    QueryResolvers,
    QueryUserArgs,
    QueryUserQuizArgs,
    QueryUsersArgs,
    Quiz,
    RequireFields,
    Resolver,
    ResolverTypeWrapper,
    Sort,
    User,
    UserPage,
} from '@nzpmc-exam-portal/common'

const userQuery: Resolver<
    ResolverTypeWrapper<User>,
    unknown,
    UserContext,
    Partial<QueryUserArgs>
> = async (_parents, {userID, userEmail}, _context) => {
    return await getUser(userID, userEmail)
}
const usersQuery: Resolver<
    ResolverTypeWrapper<UserPage>,
    unknown,
    UserContext,
    Partial<QueryUsersArgs>
> = (_parents, { page, limit, orderBy, term }, _context) => {
    if (!page) {
        page = 1
    }

    if (!limit) {
        limit = 10
    }

    if (!orderBy) {
        orderBy = { displayName: Sort.Asc }
    }

    if (!term) {
        term = ''
    }
    return getUsersPagination(page, limit, orderBy, term)
}

const meQuery: Resolver<
    ResolverTypeWrapper<User>,
    unknown,
    UserContext,
    unknown
> = (_parents, _args, context) => {
    if (context.user === undefined) {
        throw new AuthenticationError()
    }
    return getUser(context.user.uid)
}

const currentTimeQuery = (_parents, _args, _context) => {
    return new Date()
}

const imageQuery: Resolver<
    ResolverTypeWrapper<Image>[],
    unknown,
    UserContext,
    RequireFields<QueryImageArgs, 'questionID'>
> = async (_parents, { questionID }, _context) => {
    const [files] = await bucket.getFiles({
        prefix: `images/${questionID}`,
    })

    const images = files.map((file) => ({
        imageURI: `${process.env.BACKEND_URL}${file.name}`,
    }))

    return images
}

const quizQuery: Resolver<
    ResolverTypeWrapper<Omit<Quiz, 'question' | 'questions'>>,
    unknown,
    UserContext,
    RequireFields<QueryQuizArgs, 'quizID'>
> = (_parents, { quizID }, _context) => {
    return getQuiz(quizID)
}

const quizzesQuery: Resolver<
    ResolverTypeWrapper<Omit<Quiz, 'question' | 'questions'>>[],
    unknown,
    UserContext,
    unknown
> = (_parents, _args, _context) => {
    return getAllQuizzes()
}

const userQuizQuery: Resolver<
    ResolverTypeWrapper<UserQuizModel>,
    unknown,
    UserContext,
    RequireFields<QueryUserQuizArgs, 'quizID'>
> = async (_parents, args, context) => {
    if (context.user === undefined) {
        throw new AuthenticationError()
    }
    // This was wrong getUserQuiz takes argument userQuizID not quizID
    //const userQuiz = await getUserQuiz(args.quizID)
    const userQuiz = await getUserQuizbyQuizID(args.quizID)
    const user = await getUser(userQuiz.userID)

    if (user.id !== context.user.uid && !context.user.admin)
        throw new AuthenticationError()

    if (!context.user.admin) {
        // If the quiz isn't started yet, throw error
        if (!userQuiz.startTime) throw new AuthenticationError()
        userQuiz.score = undefined
    }
    return userQuiz
}

const userQuizzesQuery: Resolver<
    ResolverTypeWrapper<UserQuizModel>[],
    unknown,
    UserContext,
    unknown
> = (_parents, _args, context) => {
    if (context.user === undefined) {
        throw new AuthenticationError()
    }
    return getUserQuizzes(context.user.uid)
}

const userQuizzesByQuizIDQuerry: Resolver<
    ResolverTypeWrapper<UserQuizModel>[],
    unknown,
    UserContext,
    RequireFields<QueryUserQuizArgs, 'quizID'>
> = (_parents, args, context) => {
    if (context.user === undefined || !context.user.admin) {
        throw new AuthenticationError()
    }
    const id: string = args.quizID;
    return getUserQuizzesByQuizID(id);
}

const queryResolvers: QueryResolvers = {
    currentTime: user(currentTimeQuery),
    image: user(imageQuery),
    me: user(meQuery),
    quiz: admin(quizQuery),
    quizzes: admin(quizzesQuery),
    user: admin(userQuery),
    userQuiz: admin(userQuizQuery),
    userQuizzes: user(userQuizzesQuery),
    userQuizzesByQuizID: admin(userQuizzesByQuizIDQuerry),
    users: admin(usersQuery),
}

export default queryResolvers
