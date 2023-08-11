<script lang="ts" setup>
import logoSvg from '@/assets/logo-auth.svg'
</script>

<template>
  <div id="background">
  <MobilePlaceHolder />
  <div class="hide-for-mobile">
    <div class="align-center auth background--blue d-flex justify-center primary">
      <v-sheet class="auth-container" elevation="2" max-width="100%" width="28rem">
        <div class="d-flex pa-4" >
          <v-img :src="logoSvg" height="96" contain/>
        </div>

        <div
          v-if="userLoading || user"
          class="align-center d-flex flex-wrap justify-center pa-4 text-center"
          style="gap: 1rem"
        >
          <v-progress-circular indeterminate color="primary"></v-progress-circular>

          {{ userLoading ? 'Loading authentication service...' : 'Redirecting to the app...' }}
        </div>

        <div v-else>
          <AuthEmail
            v-if="panel === 'Email'"
            :email="email"
            @go="go"
            @update-email="(v) => (email = v)"
          />

          <AuthSignIn v-if="panel === 'SignIn'" :email="email" @go="go" />

          <AuthSignUp v-if="panel === 'SignUp'" :email="email" @go="go" />

          <AuthForgotPassword v-if="panel === 'ForgotPassword'" :email="email" @go="go" />
        </div>
      </v-sheet>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useMainStore } from '@/stores/main'
import AuthEmail from './Email.vue'
import AuthSignIn from './SignIn.vue'
import AuthSignUp from './SignUp.vue'
import AuthForgotPassword from './ForgotPassword.vue'
import MobilePlaceHolder from '../MobilePlaceholder.vue'
import { defineComponent } from 'vue'

export interface IData {
  email: string
  panel: string
}

export default defineComponent({
  name: 'AuthPage',

  metaInfo: {
    title: 'Authenticate',
    titleTemplate: '%s - NZPMC'
  },

  components: { AuthEmail, AuthSignIn, AuthSignUp, AuthForgotPassword, MobilePlaceHolder },

  data() {
    return {
      email: this.$route.query.email ?? '',

      // Panel to display
      panel: 'Email'
    }
  },

  computed: {
    // Get state from Pinia store
    ...mapState(useMainStore, ['user', 'userLoading'])
  },

  watch: {
    // Navigate to app if the user is signed in
    user: {
      handler(v) {
        if (v) this.$router.push(this.$route.query.redirect ?? { name: 'App' })
      },

      immediate: true
    }
  },

  methods: {
    // Change panel
    go(panel) {
      this.panel = panel
    }
  }
})
</script>

<style scoped lang="scss">
@import '@/styles/globals.scss';

#background {
    background-image: url(@/assets/background_unsplash_1.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.auth-container {
  border-radius: 30px;
  padding: 50px;
}

</style>

