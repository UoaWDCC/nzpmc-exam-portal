<template>
  <v-toolbar
    elevation="0"
    dense
    class="app-exam-topbar"
    color="secondary"
    style="padding-left: 256px; padding-top: 30px"
  >
    <v-toolbar-title class="text-white"> {{ name }}</v-toolbar-title>

    <v-btn
      v-if="isAdminNotSittingExam"
      v-on:click="toggleEditAndPreviewMode()"
      color="white"
      variant="outlined"
      >{{ this.isEditMode ? 'Preview' : 'Edit' }}</v-btn
    >

    <AppExamTopbarSpinner />
  </v-toolbar>
</template>

<script lang="ts">
import router from '@/router'
import AppExamTopbarSpinner from './TopbarSpinner.vue'
import quizEditingMixin from '@/utils/quizEditingMixin'

export default {
  name: 'AppExamTopbar',
  mixins: [quizEditingMixin],

  components: { AppExamTopbarSpinner },
  methods: {
    toggleEditAndPreviewMode() {
      const questionID = this.$route.params.questionID
      const quizID = this.$route.params.quizID

      const routeParams = {
        name: 'AppExamQuestion',
        params: {
          questionID,
          quizID
        },
        query: {}
      }

      if (this.isAdminAndEditing) {
        routeParams.query = { preview: 'true' }
      } else if (this.isAdminAndPreviewing) {
        routeParams.query = { edit: 'true' }
      }

      router.push(routeParams)
    }
  },

  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
