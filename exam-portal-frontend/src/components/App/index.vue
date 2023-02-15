<template>
    <div class="app grey lighten-5">
        <AppTopbar />

        <v-main style="height: 100vh; overflow: hidden">
            <router-view />
        </v-main>

        <AppSnackbar />
    </div>
</template>

<script>
import AppTopbar from './Topbar'
import AppSnackbar from './Snackbar'

export default {
    name: 'App',

    components: { AppTopbar, AppSnackbar },
}
</script>
