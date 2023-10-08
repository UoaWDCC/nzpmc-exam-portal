import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// Auth
import { useMainStore } from '@/stores/main'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { createProvider, onLogin, onLogout } from './vue-apollo'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

const customTheme = {
  dark: false,
  colors: {
    primary: '#151e33',
    secondary: '#ff9e01',
    accent: '#3f51b5',
    error: '#f44336',
    warning: '#ffeb3b',
    info: '#00bcd4',
    success: '#4caf50'
  }
}

const vuetify = createVuetify({
  components: {
    VSkeletonLoader,
    ...components
  },
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme
    }
  }
})
const apolloProvider = createProvider()
// Track user state in store
onAuthStateChanged(auth, async (user) => {
  // Let app know user state finalized
  const store = useMainStore()

  if (user) {
    onLogin(apolloProvider.defaultClient, await user.getIdToken(true)).then(async () => {
      // console.log(user)
      const currentUserIdToken = await user.getIdTokenResult()
      const userIsAdmin = currentUserIdToken.claims.admin === true
      updateUserState(store, user, userIsAdmin)
    })
  } else {
    onLogout(apolloProvider.defaultClient)
    updateUserState(store, null, false)
  }
})

function updateUserState(store, user, userIsAdmin) {
  store.user = user
  store.userIsAdmin = userIsAdmin
  store.userLoading = false
}
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(apolloProvider)

app.mount('#app')
