<template>
    <div class="login">
        <v-container style="background-color: #ecf0f1; max-width: 500px">
            <v-row align="center">
                <v-col sm="12" align="center" justify="center">
                    <img
                        style="max-width: 100%"
                        alt="NZPMC Logo"
                        src="/assets/logo.png"
                    />
                </v-col>
            </v-row>
            <form @submit.prevent="login">
                <v-row dense>
                    <v-col>
                        <v-text-field
                            placeholder="Username"
                            prepend-icon="mdi-account-circle"
                            color="#03a9f4"
                            v-model="email"
                        />
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field
                            type="Password"
                            placeholder="Password"
                            prepend-icon="mdi-lock"
                            append-icon="mdi-eye-off"
                            color="#03a9f4"
                            v-model="password"
                        />
                    </v-col>
                </v-row>
                <v-row v-if="this.loginError">
                    <v-col sm="12">
                        <v-alert type="error">{{ this.loginError }}</v-alert>
                    </v-col>
                </v-row>
                <v-row align="center" justify="center">
                    <v-col sm="12" align="end" justify="center">
                        <v-btn
                            x-large
                            color="#03a9f4"
                            style="max-width: 100%"
                            type="submit"
                            >Login</v-btn
                        >
                    </v-col>
                </v-row>
            </form>
        </v-container>
    </div>
</template>

<style scoped>
.login {
    margin-top: 5rem;
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
        }
    },
    methods: {
        async login() {
            await firebase
                .auth()
                .signInWithEmailAndPassword(this.email, this.password)
                .catch((error) => {
                    this.loginError = error.message
                })
            const res = await firebase.auth().currentUser.getIdToken(true)
            onLogin(this.$apollo.provider.defaultClient, res)
            this.$router.push('/welcome')
        },
    },
}
</script>
