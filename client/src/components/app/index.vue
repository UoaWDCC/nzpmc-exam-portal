<template>
    <div class="app grey lighten-5 hide-for-mobile">
        <AppLoadingScreen v-if="loadingMessage" :message="loadingMessage" />

        <div v-else>
            <AppTopbar />
			<!--Hack solution for broken exam page -->
            <v-main style="padding-left: 0; padding-top: 33px; height: 100vh; overflow: hidden">
                <router-view />
            </v-main>
        </div>

        <AppSnackbar />
    </div>
</template>

<script lang="ts">
import { mapState } from 'pinia'
import { useMainStore } from '@/stores/main'
import AppLoadingScreen from './LoadingScreen.vue'
import AppTopbar from './Topbar.vue'
import AppSnackbar from './Snackbar.vue'

export default {
    name: 'App',

    metaInfo: {
        title: 'App',
        titleTemplate: '%s - NZPMC',
    },

    components: { AppLoadingScreen, AppTopbar, AppSnackbar },

    computed: {
        // Get state from Pinia store
        ...mapState(useMainStore, ['user', 'userLoading']),

        // Get loading messages to block rendering
        loadingMessage() {
            return this.userLoading
                ? 'Loading authentication service...'
                : this.user === null
                ? 'Redirecting to the authentication page...'
                : null
        },
    },

    watch: {
        // User changed, check if authorised
        user: {
            handler() {
                this.checkAuth()
            },

            immediate: true,
        },

        // User loading changed, check if authorised
        userLoading() {
            this.checkAuth()
        },
    },

    methods: {
        // Check if user has authorisation to be on the page
        checkAuth() {
            if (!this.userLoading && this.user === null) {
                // Navigate to auth
                const email = this.$route.query.email ?? undefined
                this.$router.push({
                    name: 'Auth',
                    query: { redirect: this.$route.path, email },
                })
            }
        },
    },
}
</script>
