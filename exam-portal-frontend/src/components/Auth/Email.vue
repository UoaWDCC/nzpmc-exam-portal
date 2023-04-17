<template>
    <v-form
        ref="form"
        v-model="valid"
        :disabled="loading"
        class="auth-email"
        @submit="nextPanel"
    >
        <AuthHeader
            title="Authenticate"
            text="Please sign in or sign up to continue."
        />

        <div class="pb-4 px-4">
            <v-text-field
                v-model="currentEmail"
                label="Email"
                placeholder="john.smith@example.com"
                type="email"
                autocomplete="username"
                hide-details="auto"
                :rules="[
                    (v) => !!v || 'This is required',
                    (v) =>
                        emailRegex.test(v) ||
                        'Please enter a valid email address',
                ]"
                required
                autofocus
            ></v-text-field>

            <input
                type="password"
                autocomplete="current-password"
                label="Password"
                style="height: 0"
                tabindex="-1"
            />
        </div>

        <v-expand-transition>
            <v-alert v-if="error" type="error" dismissible class="mx-4">{{
                error
            }}</v-alert>
        </v-expand-transition>

        <div class="d-flex justify-end pb-4 px-4">
            <v-btn
                color="primary"
                type="submit"
                :disabled="!valid || loading"
                :loading="loading"
                text
            >
                Continue

                <v-icon right dark>mdi-arrow-right</v-icon>
            </v-btn>
        </div>
    </v-form>
</template>

<script>
import { auth } from '@/firebase'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import AuthHeader from './Header'

export default {
    name: 'AuthEmail',

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
            valid: null,
            loading: false,
            error: null,

            currentEmail: this.email,
            emailRegex:
                /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
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
            if (this.$route.query.email && this.$refs.form.validate()) {
                this.nextPanel()
                this.$router.replace({
                    query: { ...this.$route.query, email: undefined },
                })
            }
        })
    },

    methods: {
        // Show the sign up or sign in form
        nextPanel(e) {
            if (e) e.preventDefault()

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
                            this.error = this.$errorMessage
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
