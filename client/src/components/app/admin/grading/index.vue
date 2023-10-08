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
    <h1>
      {{ this.quiz ? this.quiz.name : '' }} -
      {{ this.quiz && this.quiz.released ? 'Released' : 'Unreleased' }}
    </h1>
    <v-btn
      color="secondary"
      @click="$router.push({ name: 'AppAdmin', query: { quizID: $route.query.quizID } })"
      >Back</v-btn
    >
    <v-btn color="secondary" @click="gradeAllQuizzes()">Grade Exam</v-btn>
    <v-btn color="primary" @click="releaseAllQuizzes()">Release Results</v-btn>
    <v-table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Score</th>
          <th>Submitted</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="userQuiz in userQuizzes" :key="userQuiz.id">
          <td>{{ userQuiz.user?.displayName }}</td>
          <td>{{ userQuiz.user?.email }}</td>
          <td>{{ userQuiz.score ?? 'n/a' }}</td>
          <td>{{ userQuiz.submitted }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import quizEditingMixin from '@/utils/quizEditingMixin'
import { UserQuizzesByQuizIDQuery } from '@/gql/queries/userQuiz'
import { GradeAllUserQuizzesForQuizMutation } from '@/gql/mutations/userQuiz'
import { ReleaseAllUserQuizResultsForQuiz } from '@/gql/mutations/quiz'
import type { Quiz, UserQuiz } from '@nzpmc-exam-portal/common'
import { GetQuizInfoQuery } from '@/gql/queries/quiz'
export default defineComponent({
  name: 'AppGrading',
  mixins: [quizEditingMixin],
  computed: {
    quizID() {
      return this.route.query.quizID
    },
    cacheKey() {
      return `${this.quizID}-user-quizzes`
    }
  },
  data(): {
    quiz: Quiz | undefined
    userQuizzes: UserQuiz[]
  } {
    return {
      quiz: undefined,
      userQuizzes: []
    }
  },
  apollo: {
    quiz: {
      query: GetQuizInfoQuery,
      variables() {
        return {
          quizId: this.quizID
        }
      },
      result({ data, error }) {
        if (error) {
          console.error(error)
          this.$router.push({ name: 'AppAdmin' })
        } else {
          if (data) {
            this.quiz = data.quiz
            localStorage.setItem(`${this.quizID}`, JSON.stringify(this.quiz))
          }
        }
      },
      fetchPolicy: 'network-only'
    },
    userQuizzesByQuizID: {
      skip() {
        return !this.quizID
      },
      query: UserQuizzesByQuizIDQuery,
      variables() {
        return {
          quizID: this.quizID
        }
      },
      result({ data, error }) {
        if (error) {
          console.error(error)
          this.$router.push({ name: 'AppAdmin' })
        } else {
          if (data) {
            this.userQuizzes = data.userQuizzesByQuizID
            sessionStorage.setItem(this.cacheKey, JSON.stringify(this.userQuizzes))
          }
        }
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    }
  },
  methods: {
    async gradeAllQuizzes() {
      await this.$apollo.mutate({
        mutation: GradeAllUserQuizzesForQuizMutation,
        variables: {
          quizID: this.quizID
        }
      })
      this.$apollo.queries.userQuizzesByQuizID.refetch()
    },
    async releaseAllQuizzes() {
      await this.$apollo.mutate({
        mutation: ReleaseAllUserQuizResultsForQuiz,
        variables: {
          quizID: this.quizID
        }
      })
      this.$apollo.queries.quiz.refetch()
    }
  },
  created() {
    const cachedUserQuizzes = sessionStorage.getItem(this.cacheKey)
    if (cachedUserQuizzes) {
      this.userQuizzes = JSON.parse(cachedUserQuizzes)
    }
  },
  mounted() {
    if (!this.isAdmin) {
      this.$router.push({
        name: 'AppExams'
      })
    }
    const cachedQuizInfo = localStorage.getItem(`${this.quizID}`)
    if (cachedQuizInfo) {
      this.quiz = JSON.parse(cachedQuizInfo)
    }
  }
})
</script>
