import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import VueLaTeX2JS from './plugins/latex'
import 'material-icons/iconfont/material-icons.css'
import firebase from 'firebase'
import firebaseConfig from './firebaseConfig.json'
import { createProvider } from './vue-apollo'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

let firebaseLoaded = false
firebase.auth().onAuthStateChanged(function (user) {
    if (firebaseLoaded && user) {
        // New user, show welcome page
        router.push('/welcome')
    } else if (firebaseLoaded && !user) {
        // Logged out, show login
        router.push('/')
    }
    firebaseLoaded = true // Prevents the initial firebase user change calling this, as the router deals with this
})

Vue.config.productionTip = false

new Vue({
    vuetify,
    router,
    VueLaTeX2JS,
    apolloProvider: createProvider(),
    render: (h) => h(App),
}).$mount('#app')
