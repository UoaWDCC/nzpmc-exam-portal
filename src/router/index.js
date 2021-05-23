import Vue from 'vue'
import VueRouter from 'vue-router'
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
    },
    {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
    },
    {
        path: '/exam',
        name: 'Exam',
        component: Exam,
    },
    {
        path: '/submission',
        name: 'Submission',
        component: Submission,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router
