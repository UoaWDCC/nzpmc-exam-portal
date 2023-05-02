import {
    getAllQuizzes,
    getQuiz,
    getUser,
    getUserQuiz,
    getUserQuizzes,
    getUsersPagination,
} from '../controllers'
import { AuthenticationError } from '../utils/errors'
import { bucket, UserContext } from '../utils/firebase'
import { UserQuizModel } from './custom/userQuizModel'
import { admin, user } from './helpers/auth'
import {
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
} from '@nzpmc-exam-portal/common/resolvers-types'

const userQuery: Resolver<
    ResolverTypeWrapper<User>,
    unknown,
    UserContext,
    RequireFields<QueryUserArgs, 'userID'>
> = async (_parents, args, _context) => {
    return await getUser(args.userID)
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
    const userQuiz = await getUserQuiz(args.quizID)
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

const queryResolvers: QueryResolvers = {
    currentTime: user(currentTimeQuery),
    image: user(imageQuery),
    me: user(meQuery),
    quiz: admin(quizQuery),
    quizzes: admin(quizzesQuery),
    user: admin(userQuery),
    userQuiz: admin(userQuizQuery),
    userQuizzes: admin(userQuizzesQuery),
    users: admin(usersQuery),
}

export default queryResolvers
