import {
    getUser,
    getAllUsers,
    addUser,
    editUser,
    addUserQuiz,
    getQuiz,
} from '../controllers'
import { AuthenticationError } from 'apollo-server-express'
import { AdminAuthenticationError } from '../utils/errors'
import { addFirebaseUser, resetUserPasswordEmail } from '../utils/firebase'

const resolvers = {
    Query: {
        user: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            return await getUser(args.userID)
        },
        me: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()

            if (!context.user) return
            return await getUser(context.user.uid)
        },
        users: async (parents, args, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            return await getAllUsers()
        },
    },
    Mutation: {
        addUser: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

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
                displayName,
                firstName,
                lastName,
                photoURL,
                email,
            )

            const user = await addUser(
                userID,
                firebaseDisplayName,
                email,
                firebasePhotoURL,
                firstName,
                lastName,
                yearLevel,
                role,
            )

            // Add UserQuiz if quizID is defined
            if (quizID) {
                const quiz = await getQuiz(quizID)
                await addUserQuiz(user, quiz)
            }

            // Send reset password email
            await resetUserPasswordEmail(email)

            return user
        },
        editUser: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()
            if (!context.user.admin) throw new AdminAuthenticationError()

            const {
                id,
                displayName,
                email,
                photoURL,
                firstName,
                lastName,
                yearLevel,
            } = input

            return await editUser(
                id,
                displayName,
                email,
                photoURL,
                firstName,
                lastName,
                yearLevel,
            )
        },
        editSelf: async (parent, { input }, context) => {
            if (!context.user) throw new AuthenticationError()

            const {
                displayName,
                email,
                photoURL,
                firstName,
                lastName,
                yearLevel,
            } = input

            return await editUser(
                uid,
                displayName,
                email,
                photoURL,
                firstName,
                lastName,
                yearLevel,
            )
        },
    },
}

export default resolvers
