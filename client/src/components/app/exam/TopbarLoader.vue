<template>
  <v-toolbar elevation="0" dense style="border-bottom: thin solid rgba(0, 0, 0, 0.12)">
    <!-- Show quiz name from userQuizzes if it already exists in the cache -->
    <v-toolbar-title v-if="userQuiz">{{ userQuiz.name }}</v-toolbar-title>

    <v-skeleton-loader v-else type="text" width="160" class="mb-n2" />

    <v-spacer />

    <v-skeleton-loader v-for="i in 2" :key="i" type="button" class="ml-2" />
  </v-toolbar>
</template>

<script lang="ts">
import { UserQuizzesQuery } from '@/gql/queries/userQuiz'

export default {
  name: 'AppExamTopbarLoader',

  /*
  apollo: {
    userQuizzes: {
      query: UserQuizzesQuery,
      result({ data, error, loading }) {
        this.loading = loading
        if (error) {
          console.error(error.message)
        } else {
          console.log(data)
          if (data) {
            data.userQuizzes.find((quiz) => quiz.id === this.$route.params.quizID)
          }
        }
      },
      fetchPolicy: 'cache-and-network'
    }
  },
  */
  data() {
    return {
      userQuiz: undefined
    }
  }
}
</script>
