<style scoped lang="scss">
.primaryContainer {
  background-color: $primary;
  color: white;
  padding: 1rem;
  display: flex;
}

.secondaryContainer {
  background-color: $secondary;
  color: black;
  padding: 1rem;
  display: flex;
}

.primaryContainer:hover,
.secondaryContainer:hover {
  opacity: 0.96;
}
</style>
<template>
  <router-link class="app-exams-link-card d-block mb-3 text-decoration-none" :to="to">
    <v-sheet v-ripple :class="containerClass" elevation="1">
      <div class="flex-grow-1">
        <h3>{{ title }}</h3>

        <span>
          {{ description }} &middot; {{ generateDurationString(duration) }} &middot;
          {{ generateDateString(openTime) }} until
          {{ generateDateString(closeTime) }}
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
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    // Router link to the exam
    to: { type: Object, required: true },
    exam: {
      type: Object,
      required: true
    },
    containerClass: { type: String, required: true }
  },

  methods: {
    generateDateString,
    generateDurationString
  }
}
</script>
