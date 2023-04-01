<template>
  <v-form
    ref="form"
    v-model="valid"
    class="auth-sign-up"
    :disabled="loading || !!success"
    @submit="signUp"
  >
    <AuthHeader
      title="Sign Up"
      :text="`Hello, ${email}.`"
      show-back
      @back="$emit('go', 'Email')"
    />

    <div class="pb-4 px-4">
      <v-text-field
        label="Email"
        :value="email"
        type="email"
        autocomplete="username"
        hide-details="auto"
        class="mb-4"
        disabled
      ></v-text-field>

      <v-text-field
        v-model="password"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="new-password"
        label="Password"
        :rules="[
          (v) => !!v || 'This is required',
          (v) => v.length >= 6 || 'At least 6 characters',
        ]"
        required
        class="mb-4"
        autofocus
        hide-details="auto"
        counter
        @input="passwordChange"
        @click:append="showPassword = !showPassword"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        type="password"
        autocomplete="new-password"
        label="Confirm password"
        :rules="[(v) => v === password || 'Passwords do not match']"
        hide-details="auto"
      ></v-text-field>
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
      <v-btn
        color="primary"
        type="submit"
        :disabled="!valid || loading || !!success"
        :loading="loading"
      >
        <v-icon left dark>mdi-account-plus</v-icon>

        Sign Up
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AuthHeader from "./Header";

export default {
  name: "AuthSignUp",

  metaInfo: {
    title: "Sign Up",
  },

  components: { AuthHeader },

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      // Form
      valid: true,
      loading: false,
      error: null,
      success: null,

      password: "",
      showPassword: false,
      confirmPassword: "",
    };
  },

  methods: {
    // If the password is changed, confirm password field needs to be revalidated
    passwordChange() {
      this.$refs.form.validate();
    },

    // Submit the sign up form
    signUp(e) {
      e.preventDefault();

      // Determine if account exists
      this.loading = true;
      this.error = null;

      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          // Success
          this.success = "Account created successfully.";
        })
        .catch((error) => {
          // An error occurred
          switch (error.code) {
            case "auth/email-already-in-use":
              this.error = "An account with this email address already exists.";
              break;
            case "auth/weak-password":
              this.error = "The password is not strong enough.";
              break;
            default:
              this.error = this.$errorMessage;
          }
        })
        .finally(() => {
          // Clean up loading state
          this.loading = false;
        });
    },
  },
};
</script>
