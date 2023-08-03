<template>
  <v-toolbar
    elevation="0"
    dense
    class="app-exam-topbar"
    style="padding-left: 256px; padding-top: 30px; border-bottom: thin solid rgba(0, 0, 0, 0.12)"
  >
    <v-toolbar-title>{{ name }}</v-toolbar-title>

    <v-spacer />

    <AppExamTopbarSpinner />
  </v-toolbar>
</template>

<script lang="ts">
import AppExamTopbarSpinner from './TopbarSpinner.vue'
import AppExamTopbarTimer from './TopbarTimer.vue'

export default {
  name: 'AppExamTopbar',

  components: { AppExamTopbarSpinner, AppExamTopbarTimer },

  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
