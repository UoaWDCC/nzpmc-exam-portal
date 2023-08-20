<style scoped lang="scss">
.container {
  background-color: $primary;
  color: white;
  padding: 1rem;
  display: flex;
}
.container:hover {
  opacity: 0.96;
}
</style>
<template>
  <router-link class="app-exams-link-card d-block mb-3 text-decoration-none" :to="to">
    <v-sheet v-ripple class="container" elevation="1">
      <div class="flex-grow-1">
        <h3>{{ title }}</h3>

        <span>
          {{ description }} &middot; {{ generateDurationString(duration) }} &middot;
          {{ generateDateString(startTime) }} until
          {{ generateDateString(endTime) }}
        </span>
      </div>

      <v-icon>mdi-chevron-right</v-icon>
    </v-sheet>
  </router-link>
</template>

<script lang="ts">
import { generateDateString, generateDurationString } from '@/helpers'

export default {
  name: 'AppExamsLinkCard',

  props: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    // Router link to the exam
    to: { type: Object, required: true }
  },

  methods: {
    generateDateString,
    generateDurationString
  }
}
</script>
