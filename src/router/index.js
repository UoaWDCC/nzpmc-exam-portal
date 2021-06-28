import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'
import Login from '../views/Login'
import Welcome from '../views/Welcome'
import Exam from '../views/Exam'
import Submission from '../views/Submission'

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
        path: '/exam',
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
    if (to.matched.some((record) => record.meta.authRequired)) {
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
