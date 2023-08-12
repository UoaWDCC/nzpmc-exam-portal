<style scoped lang="scss">
#submit-button {
  width: calc(100% - 15px);
  margin-left: 6px;
  margin-bottom: 1rem;
  color: white;
}
</style>
<template>
  <AppExamTopbarTimer />
  <v-list dense nav class="app-exam-sidebar" style="overflow: auto">
    <v-divider color="white" thickness="3" class="border-opacity-100 mb-5" />
    <v-list-item-group v-model="selected" color="primary">
      <AppExamSidebarLink v-for="(question, index) in questions" :id="question.id" :key="index" :number="index + 1"
        :answered="question.userAnswer !== null" :flagged="question.flag" />
    </v-list-item-group>
  </v-list>
  <v-btn color="secondary" depressed id="submit-button">Submit</v-btn>
</template>

<script lang="ts">
import AppExamTopbarTimer from './TopbarTimer.vue'
import AppExamSidebarLink from './SidebarLink.vue'
import type { UserQuizQuestion } from '@nzpmc-exam-portal/common'
import type { PropType } from 'vue'
const SIDEBAR_WIDTH = 56

export default {
  name: 'AppExamSidebar',

  components: { AppExamSidebarLink, AppExamTopbarTimer },

  props: {
    questions: {
      type: Object as PropType<UserQuizQuestion[]>,
      required: true,
      validator(v: UserQuizQuestion[]) {
        return v.every(
          (question) =>
            'id' in question &&
            typeof question.id === 'string' &&
            'flag' in question &&
            typeof question.flag === 'boolean' &&
            'userAnswer' in question
        )
      }
    }
  },

  data() {
    return {
      SIDEBAR_WIDTH,

      selected: 0
    }
  },

  watch: {
    // If no question is selected, go to the first one
    selected: {
      handler(v) {
        if (v === undefined && this.questions[0])
          this.$router.push({
            name: 'AppExamQuestion',
            params: {
              quizID: this.$route.params.quizID,
              questionID: this.questions[0]?.id
            }
          })
      }
    }
  }
}
</script>
