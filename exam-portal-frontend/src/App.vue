<template>
    <v-app>
        <v-progress-linear
            v-if="routeLoading"
            indeterminate
            color="secondary"
            style="z-index: 10; position: fixed"
        ></v-progress-linear>

        <router-view class="root" />
    </v-app>
</template>

<script>
import { mapState } from 'pinia'
import { useMainStore } from '@/stores/main'

export default {
    name: 'App',

    computed: {
        // Get state from Pinia store
        ...mapState(useMainStore, ['routeLoading']),
    },
}
</script>

<style>
.background--grey,
.background--blue {
    background-attachment: fixed;
    background-position: center;
    background-repeat: repeat;
    background-size: auto;
}
.background--grey {
    background-image: url('@/assets/background-grey.svg');
}
.background--blue {
    background-image: url('@/assets/background-blue.svg');
}
</style>

<style scoped>
.root {
    min-height: 100vh;
}
</style>
