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
import { admin, user } from './helpers/auth'
import {
    Image,
    Maybe,
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
    UserQuiz,
} from './resolvers-types'

const userQuery: Resolver<
    Maybe<ResolverTypeWrapper<User>>,
    {},
    UserContext,
    RequireFields<QueryUserArgs, 'userID'>
> = async (parents, args, context) => {
    return await getUser(args.userID)
}
const usersQuery: Resolver<
    ResolverTypeWrapper<UserPage>,
    {},
    UserContext,
    Partial<QueryUsersArgs>
> = (parents, { page, limit, orderBy }, context) => {
    if (!page) {
        page = 1
    }

    if (!limit) {
        limit = 10
    }

    if (!orderBy) {
        orderBy = { displayName: Sort.Asc }
    }
    return getUsersPagination(page, limit, orderBy)
}

const meQuery: Resolver<
    Maybe<ResolverTypeWrapper<User>>,
    {},
    UserContext,
    {}
> = (parents, args, context) => {
    if (context.user === undefined) {
        throw new AuthenticationError()
    }
    return getUser(context.user.uid)
}

const currentTimeQuery = (parents, args, context) => {
    return new Date()
}

const imageQuery: Resolver<
    Maybe<ResolverTypeWrapper<Image>>[],
    {},
    UserContext,
    RequireFields<QueryImageArgs, 'questionID'>
> = async (parents, { questionID }, context) => {
    const [files] = await bucket.getFiles({
        prefix: `images/${questionID}`,
    })

    const images = files.map((file) => ({
        imageURI: `${process.env.BACKEND_URL}${file.name}`,
    }))

    return images
}

const quizQuery: Resolver<
    Maybe<ResolverTypeWrapper<Quiz>>,
    {},
    UserContext,
    RequireFields<QueryQuizArgs, 'quizID'>
> = (parents, { quizID }, context) => {
    return getQuiz(quizID)
}

const quizzesQuery: Resolver<
    Maybe<Maybe<ResolverTypeWrapper<Quiz>>[]>,
    {},
    UserContext,
    {}
> = (parents, args, context) => {
    return getAllQuizzes()
}

const userQuizQuery: Resolver<
    Maybe<ResolverTypeWrapper<UserQuiz>>,
    {},
    UserContext,
    RequireFields<QueryUserQuizArgs, 'quizID'>
> = async (parents, args, context) => {
    if (context.user === undefined) {
        throw new AuthenticationError()
    }
    const userQuiz = await getUserQuiz(args.quizID)
    const user = await userQuiz.userObj.get()

    if (user.id !== context.user.uid && !context.user.admin)
        throw new AuthenticationError()

    if (!context.user.admin) {
        // If the quiz isn't started yet, throw error
        if (!userQuiz.startTime) throw new AuthenticationError()
        userQuiz.score = null
    }
    return userQuiz
}

const userQuizzesQuery: Resolver<
    Maybe<Maybe<ResolverTypeWrapper<UserQuiz>>[]>,
    {},
    UserContext,
    {}
> = (parents, args, context) => {
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
