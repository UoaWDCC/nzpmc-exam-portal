<template>
    <v-container>
        <v-overlay :value="true" v-if="loading" align="center">
            <v-progress-circular indeterminate size="80" />
            <h2 justify="space-around" style="margin-top: 20px">Loading...</h2>
            <p class="mt-2">
                If your browser does not load, please check your internet
                connection and try again.
            </p>
        </v-overlay>
        <v-row class="justify-center">
            <v-col class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <v-card class="pa-4" elevation="2">
                    <v-row>
                        <v-col class="col-12">
                            <img
                                style="width: 100%; max-width: 300px"
                                class="d-block mx-auto"
                                alt="NZPMC Logo"
                                src="../assets/logo.png"
                            />
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="justify-center">
            <v-col class="col-12 col-sm-6 col-lg-4 col-xl-3">
                <v-card class="pa-4" elevation="2">
                    <v-row>
                        <v-col class="text-start">
                            <h1>Login</h1>
                        </v-col>
                    </v-row>
                    <form @submit.prevent="login">
                        <v-row>
                            <v-col>
                                <v-text-field
                                    v-model="email"
                                    :rules="[rules.required, rules.email]"
                                    label="Email"
                                    color="#03a9f4"
                                    autocomplete="username"
                                >
                                    <v-icon
                                        slot="prepend"
                                        class="material-icons"
                                    >
                                        account_circle
                                    </v-icon>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                    v-model="password"
                                    :rules="[rules.required]"
                                    :type="showPassword ? 'text' : 'password'"
                                    label="Password"
                                    color="#03a9f4"
                                    autocomplete="current-password"
                                >
                                    <v-icon
                                        slot="prepend"
                                        class="material-icons"
                                    >
                                        lock
                                    </v-icon>
                                    <v-icon
                                        slot="append"
                                        class="material-icons"
                                        @click="showPassword = !showPassword"
                                    >
                                        {{
                                            showPassword
                                                ? 'visibility'
                                                : 'visibility_off'
                                        }}
                                    </v-icon>
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="this.loginError">
                            <v-col>
                                <v-alert type="error" icon="">
                                    <v-icon
                                        slot="prepend"
                                        class="material-icons mr-4"
                                        >warning</v-icon
                                    >{{ this.loginError }}</v-alert
                                >
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="text-right">
                                <v-btn large color="primary" type="submit">
                                    <v-icon left class="material-icons">
                                        login
                                    </v-icon>
                                    Login
                                </v-btn>
                            </v-col>
                        </v-row>
                    </form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>
.v-input__prepend-outer {
    margin-right: 0.5rem;
}
</style>

<script>
import firebase from 'firebase'
import { onLogin } from '../vue-apollo'
export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            loginError: null,
            showPassword: false,
            rules: {
                required: (value) => !!value || 'Required.',
                email: (value) => {
                    const pattern =
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                },
                emailMatch: () =>
                    'The email and password you entered do not match',
            },
            loading: false,
        }
    },
    methods: {
        async login() {
            this.loading = true
            if (this.loading === true) {
                await firebase
                    .auth()
                    .signInWithEmailAndPassword(this.email, this.password)
                    .catch((error) => {
                        this.loginError = error.message
                    })
                onLogin(this.$apollo.provider.defaultClient)
            }
        },
    },
}
</script>
