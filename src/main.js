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

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

let firebaseLoaded = false
firebase.auth().onAuthStateChanged(async function (user) {
    // Update token to be used for backend authentication
    if (user && typeof localStorage !== 'undefined') {
        localStorage.setItem(
            AUTH_TOKEN,
            await firebase.auth().currentUser.getIdToken(true),
        )
    } else if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN)
    }

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
