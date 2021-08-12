import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import Login from '../views/Login'
import Welcome from '../views/Welcome'
import Exam from '../views/Exam'
import Submission from '../views/Submission'
import Admin from '../views/Admin'
import QuizAdmin from '../views/QuizAdmin'
import QuizAdminDetails from '../views/QuizAdminDetails'
import QuizAdminUsers from '../views/QuizAdminUsers'
import QuizAdminQuestion from '../views/QuizAdminQuestion'
import UserAdmin from '../views/UserAdmin'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: {
            title: 'Login - NZPMC',
        },
    },
    {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
        meta: {
            title: 'Welcome - NZPMC',
            authRequired: true,
        },
    },
    {
        path: '/exam/:quizId?',
        name: 'Exam',
        component: Exam,
        meta: {
            title: 'Exam - NZPMC',
            authRequired: true,
        },
    },
    {
        path: '/submission',
        name: 'Submission',
        component: Submission,
        meta: {
            title: 'Submission - NZPMC',
            authRequired: true,
        },
    },
    {
        path: '/admin',
        component: Admin,
        redirect: { name: 'QuizAdmin' },
        children: [
            {
                path: 'quiz',
                name: 'QuizAdmin',
                component: QuizAdmin,
                meta: {
                    title: 'Quiz Admin - NZPMC',
                    authRequired: true,
                    adminRequired: true,
                },
                children: [
                    {
                        path: 'create',
                        name: 'QuizAdminCreateQuiz',
                        component: QuizAdminDetails,
                        meta: {
                            title: 'Quiz Admin - NZPMC',
                            authRequired: true,
                            adminRequired: true,
                        },
                    },
                    {
                        path: ':quizId',
                        component: QuizAdmin,
                        redirect: { name: 'QuizAdminDetails' },
                    },
                    {
                        path: ':quizId/details',
                        name: 'QuizAdminDetails',
                        component: QuizAdminDetails,
                        meta: {
                            title: 'Quiz Admin - NZPMC',
                            authRequired: true,
                            adminRequired: true,
                        },
                    },
                    {
                        path: ':quizId/users',
                        name: 'QuizAdminUsers',
                        component: QuizAdminUsers,
                        meta: {
                            title: 'Quiz Admin - NZPMC',
                            authRequired: true,
                            adminRequired: true,
                        },
                    },
                    {
                        path: ':quizId/question',
                        redirect: { name: 'QuizAdminDetails' },
                    },
                    {
                        path: ':quizId/question/create',
                        name: 'QuizAdminCreateQuestion',
                        component: QuizAdminQuestion,
                        meta: {
                            title: 'Quiz Admin - NZPMC',
                            authRequired: true,
                            adminRequired: true,
                        },
                    },
                    {
                        path: ':quizId/question/:questionId',
                        name: 'QuizAdminQuestion',
                        component: QuizAdminQuestion,
                        meta: {
                            title: 'Quiz Admin - NZPMC',
                            authRequired: true,
                            adminRequired: true,
                        },
                    },
                ],
            },
            {
                path: 'user',
                name: 'UserAdmin',
                component: UserAdmin,
                meta: {
                    title: 'User Admin - NZPMC',
                    authRequired: true,
                    adminRequired: true,
                },
            },
        ],
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

// Run user login checks
function getCurrentUser() {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            unsubscribe()
            resolve(user)
        }, reject)
    })
}

router.beforeEach(async (to, from, next) => {
    Vue.prototype.$loading = true
    document.title = to.meta.title ? to.meta.title : 'NZPMC'
    if (to.matched.some((record) => record.meta.adminRequired)) {
        // When the requested page requires admin access
        if (await getCurrentUser()) {
            // Check if auth token shows admin access
            const jwt = await firebase.auth().currentUser.getIdToken(true)
            const payload = jwt.split('.')[1]
            const isAdmin = JSON.parse(atob(payload)).admin

            if (isAdmin) {
                next()
            } else {
                next(false)
                router.push('/welcome')
            }
        } else {
            next(false)
            router.push('/')
        }
    } else if (to.matched.some((record) => record.meta.authRequired)) {
        // When the requested page requires authentication
        if (await getCurrentUser()) {
            next()
        } else {
            next(false)
            router.push('/')
        }
    } else {
        // No authentication needed, not available to logged in users
        if (await getCurrentUser()) {
            next(false)
            router.push('/welcome')
        } else {
            next()
        }
    }
    Vue.prototype.$loading = false
})

export default router
