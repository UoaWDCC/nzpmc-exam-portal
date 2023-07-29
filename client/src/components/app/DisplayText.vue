<template>
  <latex :content="parsed" style="margin-bottom: -16px" />
</template>

<script lang="ts">
import { Converter } from 'showdown'

export default {
  name: 'AppDisplayText',

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
