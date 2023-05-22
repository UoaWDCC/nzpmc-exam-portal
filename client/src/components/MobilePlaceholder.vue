<script setup lang="ts">
import logoBg from '@/assets/logo-background.jpg'
</script>

<template>
    <div class="hide-for-desktop">
        <div class="message pa-4 red--text">
            <h1 class="mb-4 text-h4">Page Not Found</h1>

            <p>Sorry about that.</p>

            <v-btn color="white" outlined :to="{ name: 'AppExams' }">
                <v-icon left>mdi-home</v-icon>

                <span>Go Home</span>
            </v-btn>
        </div>
    </div>
</template>

<style scoped>
.message {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    box-shadow: inset 0px 360px 240px -240px black;
}
</style>
