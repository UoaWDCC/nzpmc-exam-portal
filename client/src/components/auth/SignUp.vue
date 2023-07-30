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
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                label="Password"
                :rules="[
                    (v: string) => !!v || 'This is required',
                    (v: string) => v.length >= 6 || 'At least 6 characters',
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
                :rules="[(v: string) => v === password || 'Passwords do not match']"
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
                color="secondary"  
                type="submit"
                :disabled="!valid || loading || !!success"
                :loading="loading"
            >
                <v-icon left dark>mdi-account-plus</v-icon>

                <span class="text-white">&nbsp;Sign Up</span>
            </v-btn>
        </div>
    </v-form>
</template>

<script lang="ts">

import { auth } from '@/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import AuthHeader from './Header.vue'

export interface IData {
    valid: boolean
    loading: boolean
    error: string | null
    success: string | null
    password: string
    showPassword: boolean
    confirmPassword: string
}

export default {
    name: 'AuthSignUp',

    metaInfo: {
        title: 'Sign Up',
    },

    components: { AuthHeader },

    props: {
        email: {
            type: String,
            required: true,
        },
    },

    $refs: {
        form: HTMLFormElement
    },

    data(): IData {
        return {
            // Form
            valid: true,
            loading: false,
            error: null,
            success: null,

            password: '',
            showPassword: false,
            confirmPassword: '',
        }
    },

    methods: {
        // If the password is changed, confirm password field needs to be revalidated
        passwordChange() {
            // this.$refs.form.validate()
            (this.$refs["form"] as HTMLFormElement).validate()
        },

        // Submit the sign up form
        signUp(e: Event) {
            e.preventDefault()

            // Determine if account exists
            this.loading = true
            this.error = null

            createUserWithEmailAndPassword(auth, this.email, this.password)
                .then(() => {
                    // Success
                    this.success = 'Account created successfully.'
                })
                .catch((error) => {
                    // An error occurred
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            this.error =
                                'An account with this email address already exists.'
                            break
                        case 'auth/weak-password':
                            this.error = 'The password is not strong enough.'
                            break
                        default:
                            this.error = "default error message"
                            // this.$errorMessage
                    }
                })
                .finally(() => {
                    // Clean up loading state
                    this.loading = false
                })
        },
    },
}
</script>
