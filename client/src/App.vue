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

<script lang="ts">
import { mapState } from 'pinia'
import { useMainStore } from '@/stores/main'
import '@/styles/globals.scss'

export default {
  name: 'App',

  computed: {
    // Get state from Pinia store
    ...mapState(useMainStore, ['routeLoading'])
  }
}
</script>
