<template>
  <v-form v-model="valid" class="auth-sign-in" :disabled="loading || !!success" @submit="signIn">
    <AuthHeader
      id="back"
      title="Sign In"
      :text="`Hello, ${email}.`"
      show-back
      @back="$emit('go', 'Email')"
    />

    <div class="text-subtitle-1 font-weight-black px-4">Password</div>

    <div class="pb-4 px-4">
      <input
        class="password"
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
        :rules="[(v) => !!v || 'This is required']"
        required
        autofocus
        hide-details="auto"
        @click:append="showPassword = !showPassword"
      />
    </div>

    <v-expand-transition>
      <v-alert v-if="error" type="error" dismissible class="mx-4">
        {{ error }}
      </v-alert>
    </v-expand-transition>

    <div class="align-center d-flex justify-space-between">
      <v-label
        id="forgot-password"
        small
        :disabled="!!success"
        @click="$emit('go', 'ForgotPassword')"
      >
        Forgot password?
      </v-label>

      <v-btn
        id="sign-in-button"
        type="submit"
        :disabled="!valid || loading || !!success"
        :loading="loading"
      >
        <v-icon :class="password.length > 0 ? 'active' : ''">mdi-login-variant</v-icon>
        <span class="text-white">&nbsp;Sign In</span>
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { auth } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import AuthHeader from './Header.vue'

export interface IData {
  valid: boolean
  loading: boolean
  error: string | null
  success: string | null

  password: string
  showPassword: boolean
}

export default {
  name: 'AuthSignIn',

  metaInfo: {
    title: 'Sign In'
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
      // Form
      valid: true,
      loading: false,
      error: null,
      success: null,

      password: '',
      showPassword: false
    }
  },

  methods: {
    // Submit the sign in form
    signIn(e: Event) {
      e.preventDefault()

      // Determine if account exists
      this.loading = true
      this.error = null

      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          // Success
          this.success = 'Successfully signed in.'
        })
        .catch((error) => {
          // An error occurred
          switch (error.code) {
            case 'auth/user-not-found':
              this.error = 'No account with this email address exists.'
              break
            case 'auth/user-disabled':
              this.error = 'This account has been disabled.'
              break
            case 'auth/wrong-password':
              this.error = 'The password is incorrect.'
              break
            default:
              // this.$errorMessage
              this.error = 'This is required.'
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

#sign-in-button {
  background-color: $secondary;
  text-align: center;
  position: relative;
  margin-top: 40px;
  left: 60px;
  transform: translate(-50%, -50%);
  font-size: medium;
  width: 315px;
  height: 6vh;
  border-radius: 18px;
  letter-spacing: 6px;
  i {
    color: white;
    opacity: 0.6;
    &.active {
      opacity: 1;
    }
  }
}

#forgot-password {
  text-align: center;
  position: relative;
  top: 35px;
  left: 120px;
  font-size: small;
  box-shadow: none;
  padding-right: 115px;
}

#forgot-password:hover {
  cursor: pointer;
  text-decoration: underline;
}

.password {
  background-color: white;
  border: 2px solid black;
  border-radius: 15px;
  width: 315px;
  height: 7vh;
  text-align: center;
  font-size: large;
}
</style>
