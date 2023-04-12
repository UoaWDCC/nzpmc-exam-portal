import Vue from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import VueMeta from 'vue-meta'
import router from './router'
import vuetify from './plugins/vuetify'
import { useMainStore } from '@/stores/main'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { createProvider, onLogin, onLogout } from './vue-apollo'
require('regenerator-runtime/runtime')
import VueLaTeX2JS from './plugins/latex'

// Global error message
Vue.prototype.$errorMessage =
    'An error occurred when connecting to the server. Please try again later.'

// Use plugins
Vue.config.productionTip = false
Vue.use(createPinia())
Vue.use(VueMeta)
const apolloProvider = createProvider()

new Vue({
    name: 'Main',
    router,
    VueLaTeX2JS,
    vuetify,
    apolloProvider,
    render: (h) => h(App),
}).$mount('#app')

// Track user state in store
onAuthStateChanged(auth, async (user) => {
    // Update Apollo auth status
    if (user) {
        onLogin(apolloProvider.defaultClient, await user.getIdToken(true))
    } else onLogout(apolloProvider.defaultClient)

    // Let app know user state finalised
    const store = useMainStore()
    store.user = user
    store.userLoading = false
})
