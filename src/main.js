import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import firebase from 'firebase'
import firebaseConfig from './firebaseConfig.json'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

// Run user login checks
router.beforeEach((to, from, next) => {
    console.log(firebase.auth().currentUser)
    if (to.matched.some((record) => record.meta.authRequired)) {
        if (firebase.auth().currentUser) {
            next()
        } else {
            next({
                path: '/',
            })
        }
    } else {
        next()
    }
})

Vue.config.productionTip = false

new Vue({
    vuetify,
    router,
    render: (h) => h(App),
}).$mount('#app')
