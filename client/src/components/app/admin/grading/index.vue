<style>
.app-admin-grading {
  padding-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 31px 0;
  margin: 0;
}
</style>
<template>
  <v-container class="app-admin-grading" fluid v-if="isAdmin">
    <v-btn
      color="secondary"
      @click="$router.push({ name: 'AppAdmin', query: { quizID: $route.query.quizID } })"
      >Back</v-btn
    >
    <v-btn color="secondary">Grade Exam</v-btn>
    <v-btn color="primary">Release Results</v-btn>
  </v-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import quizEditingMixin from '@/utils/quizEditingMixin'
import { UserQuizzesByQuizIDQuery } from '@/gql/queries/userQuiz'
export default defineComponent({
  name: 'AppGrading',
  mixins: [quizEditingMixin],
  apollo: {
    UserQuizzes: {
      skip() {
        return !this.$route.query.quizID
      },
      query: UserQuizzesByQuizIDQuery,
      variables() {
        return {
          quizID: this.$route.query.quizID
        }
      },
      result({ data, error }) {
        if (error) {
          console.error(error)
        } else {
          if (data) {
            console.log(data)
          }
        }
      }
    }
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push({
        name: 'AppExams'
      })
    }
  }
})
</script>
