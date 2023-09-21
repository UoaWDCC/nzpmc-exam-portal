<script setup lang="ts">
import logoBg from '@/assets/logo-background.jpg'
</script>

<template>
  <div class="not-found">
    <div class="message pa-4 red--text">
      <h1 class="mb-4 text-h4">Unauthorised</h1>

      <p>You're not allowed to access this page. Sorry about that.</p>

      <v-btn color="white" outlined :to="{ name: 'Site' }">
        <v-icon left>mdi-home</v-icon>

        <span>Go Home</span>
      </v-btn>
    </div>

    <v-img width="100%" height="100vh" :src="logoBg"></v-img>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NotFound',

  metaInfo: {
    title: 'Unauthorised - NZPMC'
  }
}
</script>

<style scoped>
.message {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  box-shadow: inset 0px 360px 240px -240px black;
}
</style>
