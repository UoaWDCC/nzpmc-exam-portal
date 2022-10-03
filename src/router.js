import Vue from 'vue'
import VueRouter from 'vue-router'
import { getAuth } from '@firebase/auth'
import Login from '@/components/Login'
import Welcome from '@/components/Welcome'
import Quiz from '@/components/Quiz/Quiz'
import Submission from '@/components/Submission'
import Admin from '@/components/Admin/Admin'
import QuizAdmin from '@/components/Admin/Quiz/QuizAdmin'
import QuizAdminDetails from '@/components/Admin/Quiz/QuizAdminDetails'
import QuizAdminUsers from '@/components/Admin/Quiz/QuizAdminUsers'
import QuizAdminQuestion from '@/components/Admin/Quiz/QuizAdminQuestion'
import QuizAdminQuestionOrder from '@/components/Admin/Quiz/QuizAdminQuestionOrder'
import UserAdmin from '@/components/Admin/User/UserAdmin'

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
        path: '/app',
        name: 'App',
        component: () =>
            import(/* webpackChunkName: "AppChunk" */ '@/components/App'),
        meta: {
            title: 'App - NZPMC',
            authRequired: true,
        },
        children: [
            {
                path: 'exam/:quizID',
                name: 'AppExam',
                // Load in same chunk as the exams route for better reliability
                component: () =>
                    import(
                        /* webpackChunkName: "AppExamsChunk" */ '@/components/App/Exam'
                    ),
                meta: {
                    title: 'Exam - NZPMC',
                    authRequired: true,
                },
                children: [
                    {
                        path: ':questionID',
                        name: 'AppExamQuestion',
                        component: () =>
                            import(
                                /* webpackChunkName: "AppExamsChunk" */ '@/components/App/Exam/Question'
                            ),
                        meta: {
                            authRequired: true,
                        },
                    },
                ],
            },
        ],
    },
    {
        path: '/quiz/:quizId',
        name: 'Quiz',
        component: Quiz,
        meta: {
            title: 'Quiz - NZPMC',
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
                        path: ':quizId/order',
                        name: 'QuizAdminOrder',
                        component: QuizAdminQuestionOrder,
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
        const unsubscribe = getAuth().onAuthStateChanged((user) => {
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
            const jwt = await getAuth().currentUser.getIdToken(true)
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
