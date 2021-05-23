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
            <v-row dense>
                <v-col>
                    <v-text-field
                        placeholder="Username"
                        prepend-icon="mdi-account-circle"
                        color="#03a9f4"
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
                    />
                </v-col>
            </v-row>
            <v-row align="center" justify="center">
                <v-col sm="12" align="end" justify="center">
                    <v-btn
                        @click="redirectToWelcome()"
                        x-large
                        color="#03a9f4"
                        style="max-width: 100%"
                        >Login</v-btn
                    >
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    methods: {
        redirectToWelcome() {
            this.$router.push({ path: '/welcome' })
        },
    },
}
</script>

<style scoped>
.login {
    margin-top: 5rem;
}
</style>
