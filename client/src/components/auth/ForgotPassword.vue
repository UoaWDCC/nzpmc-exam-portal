<template>
  <v-form class="auth-forgot-password" :disabled="loading || !!success" @submit="forgotPassword">
    <AuthHeader
      class="pb-4 px-4"
      title="Forgot your password?"
      :text="'A link to reset your password will be sent to your email.'"
      show-back
      @back="$emit('go', 'SignIn')"
    />

    <div class="pb-4 px-4">
      <input
        class="forgotPassword"
        label="Email"
        :value="email"
        type="email"
        autocomplete="username"
        hide-details="auto"
      />
    </div>

    <v-expand-transition>
      <v-alert v-if="error" type="error" dismissible class="mx-4">
        {{ error }}
      </v-alert>
    </v-expand-transition>

    <v-expand-transition>
      <v-alert v-if="success" type="success" class="mx-4">
        {{ success }}
      </v-alert>
    </v-expand-transition>

    <div class="d-flex justify-end pb-4 px-4">
      <v-btn color="secondary" type="submit" :disabled="loading || !!success" :loading="loading">
        <v-icon left dark>mdi-email</v-icon>
        <span class="text-white">&nbsp;Send email</span>
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { auth } from '@/firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
import AuthHeader from './Header.vue'

export interface IData {
  loading: boolean
  error: string | null
  success: string | null
}

export default {
  name: 'AuthForgotPassword',

  metaInfo: {
    title: 'Forgot Password'
  },

  components: { AuthHeader },

  props: {
    email: {
      type: String,
      required: true
    }
  },

  data(): IData {
    return {
      loading: false,
      error: null,
      success: null
    }
  },

  methods: {
    // Submit the sign up form
    forgotPassword(e: Event) {
      e.preventDefault()

      // Determine if account exists
      this.loading = true
      this.error = null

      sendPasswordResetEmail(auth, this.email)
        .then(() => {
          // Success
          this.success = 'Email sent successfully.'
        })
        .catch((error) => {
          // An error occurred
          switch (error.code) {
            case 'auth/user-not-found':
              this.error = 'No account with this email address exists.'
              break
            default:
              this.error = 'this is an error message'
          }
        })
        .finally(() => {
          // Clean up loading state
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/globals.scss';

.forgotPassword {
  background-color: white;
  border: 2px solid black;
  border-radius: 15px;
  width: 315px;
  height: 7vh;
  text-align: center;
  font-size: large;
}
</style>
