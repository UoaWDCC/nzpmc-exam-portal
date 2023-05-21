<template>
    <v-form ref="form" v-model="valid" :disabled="loading" class="auth-email" @submit="nextPanel">
        <AuthHeader title="Authenticate" text="Please sign in or sign up to continue." />

        <div class="pb-4 px-4">
            <v-text-field v-model="currentEmail" label="Email" placeholder="john.smith@example.com" type="email"
                autocomplete="username" hide-details="auto" :rules="[
                    (v: string) => !!v || 'This is required',
                    (v: string) =>
                        emailRegex.test(v) ||
                        'Please enter a valid email address',
                ]" required autofocus></v-text-field>

            <input type="password" autocomplete="current-password" label="Password" style="height: 0" tabindex="-1" />
        </div>

        <v-expand-transition>
            <v-alert v-if="error" type="error" dismissible class="mx-4">{{
                error
            }}</v-alert>
        </v-expand-transition>

        <div class="d-flex justify-end pb-4 px-4">
            <v-btn color="primary" type="submit" :disabled="!valid || loading" :loading="loading" text>
                Continue

                <v-icon right dark>mdi-arrow-right</v-icon>
            </v-btn>
        </div>
    </v-form>
</template>

<script lang="ts">
import { auth } from '@/firebase'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import AuthHeader from './Header.vue'

export interface IData {
    valid: boolean | null
    loading: boolean
    error: string | null

    currentEmail: string
    emailRegex: RegExp
}

export default {
    name: 'AuthEmail',

    components: { AuthHeader },

    props: {
        email: {
            type: String,
            required: true,
        },
    },

    data(): IData {
        return {
            // Form
            valid: null,
            loading: false,
            error: null,

            currentEmail: this.email,
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        }
    },

    watch: {
        currentEmail(v) {
            this.$emit('update-email', v)
        },
    },

    mounted() {
        // Automatically go to sign in or sign up page if email given in params
        this.$nextTick(() => {
            if (this.$route.query.email && (this.$refs["form"] as HTMLFormElement).validate()) {
                this.nextPanel()
                this.$router.replace({
                    query: { ...this.$route.query, email: undefined },
                })
            }
        })
    },

    methods: {
        // Show the sign up or sign in form
        nextPanel() {
            // Determine if account exists
            this.loading = true
            this.error = null

            fetchSignInMethodsForEmail(auth, this.email)
                .then((methods) => {
                    // Success
                    if (methods.length > 0) {
                        this.$emit('go', 'SignIn')
                    } else {
                        this.$emit('go', 'SignUp')
                    }
                })
                .catch((error) => {
                    // An error occurred
                    switch (error.code) {
                        case 'auth/invalid-email':
                            this.error = 'The email address is not valid.'
                            break
                        default:
                            this.error = "This is an error message"
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
