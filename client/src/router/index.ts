import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '@/stores/main'
import NotFound from '../components/NotFound.vue'

const routes = [
    {
        path: '/app',
        name: 'App',
        component: () =>
            import(/* webpackChunkName: "AppChunk" */ '../components/App/index.vue'),
        redirect: { name: 'AppExams' },
        children: [
            {
                path: 'exams',
                name: 'AppExams',
                component: () =>
                    import(
                        /* webpackChunkName: "AppExamsChunk" */ '../components/App/Exams/index.vue'
                    ),
            },
            {
                path: 'exam/:quizID',
                name: 'AppExam',
                // Load in same chunk as the exams route for better reliability
                component: () =>
                    import(
                        /* webpackChunkName: "AppExamsChunk" */ '../components/App/Exam/index.vue'
                    ),
                children: [
                    {
                        path: ':questionID',
                        name: 'AppExamQuestion',
                        component: () =>
                            import(
                                /* webpackChunkName: "AppExamsChunk" */ '../components/App/Exam/Question/index.vue'
                            ),
                    },
                ],
            },
            {
                path: 'admin',
                name: 'AppAdmin',
                component: () =>
                    import(
                        /* webpackChunkName: "AppAdminChunk" */ '../components/App/Admin/index.vue'
                    ),
            },
        ],
    },
    {
        path: '/auth',
        name: 'Auth',
        component: () =>
            import(/* webpackChunkName: "AuthChunk" */ '../components/Auth/index.vue'),
    },
    {
        path: '/site',
        name: 'Site',
        component: () =>
            import(/* webpackChunkName: "SiteChunk" */ '../components/Site/index.vue'),
    },
    {
        path: '/',
        redirect: { name: 'App' },
    },
    {
        path: '/:catchAll(.*)',
        component: NotFound,
    },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})


// Error handling for routes
router.onError((error) => {
    // Hide loading bar
    useMainStore().routeLoading = false

    if (error.name === 'ChunkLoadError') {
        // Chunk loading may fail if the cache points to an outdated version
        window.location.reload()
    }
})

// Before preparing to change route
router.beforeEach((to, from, next) => {
    // Show loading bar
    useMainStore().routeLoading = true

    next()
})

// Just before showing the new route
router.beforeResolve((to, from, next) => {
    // Hide loading bar
    useMainStore().routeLoading = false

    next()
})

export default router