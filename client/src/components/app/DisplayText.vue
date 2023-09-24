<template>
  <v-textarea :model-value="text" v-if="isAdminAndEditing"></v-textarea>
  <div v-else v-html="parsed"></div>
</template>

<script lang="ts">
import quizEditingMixin from '@/utils/quizEditingMixin'
import { Converter } from 'showdown'

export default {
  name: 'AppDisplayText',
  mixins: [quizEditingMixin],

  props: {
    text: { type: String, required: true }
  },

  data() {
    return {
      converter: new Converter()
    }
  },

  computed: {
    parsed() {
      return this.converter.makeHtml(this.text)
    }
  }
}
</script>

<style>
img {
  max-width: min(100%, 300px);
  margin: 0 auto;
  display: block;
}
</style>
