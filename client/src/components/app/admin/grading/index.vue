<style scoped lang="scss">
body {
  background-color: blue;
}
.app-admin-grading {
  background-color: #dcdcdc;
  padding: 45px 5vw;
}

#back-btn {
  background-color: $secondary;
  color: white;
  margin: 10px 0;
}

#metrics-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin: 30px 0;
}

#metrics-section > * {
  height: 40vh;
  width: 50%;
}

#left-metrics-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

#left-metrics-section > * {
  width: 100%;
}

#metric-section-buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1rem;
  width: 100%;
  gap: 0.5rem;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#table {
  margin-top: -22px;
}
</style>

<template>
  <v-container class="app-admin-grading" fluid v-if="isAdmin">
    <v-btn
      icon="mdi-arrow-left"
      variant="tonal"
      id="back-btn"
      @click="$router.push({ name: 'AppAdmin', query: { quizID: $route.query.quizID } })"
    ></v-btn>

    <h1 style="letter-spacing: 0.15rem">
      EXAM:
      <span class="font-weight-bold" style="font-size: 24px">{{ quiz ? quiz.name : '' }}</span>
    </h1>
    <h4 style="letter-spacing: 0.15rem" class="font-weight-regular">
      Release Status:
      <span
        class="font-weight-bold text-decoration-underline"
        :class="{ 'text-success': quiz && quiz.released, 'text-error': !quiz || !quiz.released }"
        >{{ this.quiz && this.quiz.released ? 'Released' : 'Unreleased' }}</span
      >
    </h4>

    <div id="metrics-section">
      <div id="left-metrics-section">
        <v-card class="card" style="height: 100%"
          ><v-card-item class="d-flex">
            <h4>Average Grade:</h4>
            <h1>{{ averageQuizScore }}</h1></v-card-item
          >
        </v-card>
        <div id="metric-section-buttons">
          <v-btn size="x-large" color="secondary" @click="gradeAllQuizzes()">Grade Exam</v-btn>
          <v-btn size="x-large" color="primary" @click="releaseAllQuizzes()">Release Results</v-btn>
        </div>
      </div>
      <v-card class="card"
        ><v-card-item
          ><h3>Average time taken: {{ averageTimeTaken }}</h3>
          <h3>Amount of people submitted: {{ amountSubmitted }}</h3>
          <h3>Median score: {{ medianScore }}</h3>
          <h3>Most failed question: {{ mostFailedQuestion }}</h3>
        </v-card-item></v-card
      >
    </div>

    <div>
      <v-text-field
        label="Search by name, email, or score"
        v-model="searchQuery"
        outlined
        clearable
      ></v-text-field>
      <v-table id="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Score</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="userQuiz in filteredUserQuizzes" :key="userQuiz.id">
            <td>{{ userQuiz.user?.displayName }}</td>
            <td>{{ userQuiz.user?.email }}</td>
            <td>{{ userQuiz.score ?? '-' }}</td>
            <td>{{ userQuiz.submitted }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
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
    },
    filteredUserQuizzes() {
      if (!this.searchQuery) {
        return this.userQuizzes
      }

      const query = this.searchQuery.toLowerCase()

      return this.userQuizzes.filter(
        (userQuiz) =>
          userQuiz.user?.displayName?.toLowerCase().includes(query) ||
          userQuiz.user?.email?.toLowerCase().includes(query) ||
          (userQuiz.score?.toString() ?? '').includes(query)
      )
    },
    averageQuizScore() {
      if (!this.userQuizzes) {
        return 0
      }

      const scores = this.userQuizzes.map((userQuiz) => {
        return userQuiz.score ?? 0
      })
      const total = scores.reduce((a, b) => a + b, 0)
      const averageScore = total / scores.length
      const averagePercentage = (
        (averageScore.toFixed(0) / this.quiz?.questions?.length) *
        100
      ).toFixed(2)
      if (isNaN(averagePercentage)) {
        return '-'
      }
      return `${averagePercentage}% (${averageScore.toFixed(0)} / ${this.quiz?.questions?.length})`
    },
    averageTimeTaken() {
      if (!this.userQuizzes) {
        return 0
      }

      const times = this.userQuizzes.map((userQuiz) => {
        return userQuiz.duration ?? 0
      })
      const total = times.reduce((a, b) => a + b, 0)
      const averageTime = total / times.length
      if (isNaN(averageTime)) {
        return '-'
      }
      return `${averageTime.toFixed(0)} seconds`
    },
    amountSubmitted() {
      if (!this.userQuizzes) {
        return 0
      }
      const totalSubmitted = this.userQuizzes.filter((userQuiz) => userQuiz.submitted).length
      if (isNaN(totalSubmitted)) {
        return '- / -'
      }
      return `${totalSubmitted} / ${this.userQuizzes.length}`
    },
    medianScore() {
      if (!this.userQuizzes) {
        return 0
      }
      const scores = this.userQuizzes.map((userQuiz) => {
        return userQuiz.score ?? 0
      })
      const sortedScores = scores.sort((a, b) => a - b)
      const middle = Math.floor(sortedScores.length / 2)
      const isEven = sortedScores.length % 2 === 0
      const median = isEven
        ? (sortedScores[middle] + sortedScores[middle - 1]) / 2
        : sortedScores[middle]
      const medianPercentage = ((median.toFixed(0) / this.quiz?.questions?.length) * 100).toFixed(2)
      if (isNaN(medianPercentage)) {
        return '-'
      }
      return `${medianPercentage}% (${median.toFixed(0)} / ${this.quiz?.questions?.length})`
    },
    mostFailedQuestion() {
      if (!this.userQuizzes) {
        return 0
      }
      const questions = this.quiz?.questions ?? []
      const questionIDs = questions.map((question) => {
        return question.id
      })
      const questionIDsAndScores = questionIDs.map((questionID) => {
        const scores = this.userQuizzes.map((userQuiz) => {
          const question = userQuiz.questions?.find((question) => question.id === questionID)
          return question?.score ?? 0
        })
        const total = scores.reduce((a, b) => a + b, 0)
        return { questionID, total }
      })
      const sortedQuestionIDsAndScores = questionIDsAndScores.sort((a, b) => a.total - b.total)
      let mostFailedQuestionID: string
      try {
        mostFailedQuestionID = sortedQuestionIDsAndScores[0].questionID
      } catch {
        return '-'
      }
      const mostFailedQuestion = questions.find((question) => question.id === mostFailedQuestionID)
      const questionNumber = questions.indexOf(mostFailedQuestion ?? questions[0]) + 1
      return `${mostFailedQuestion?.question} (${questionNumber})` ?? '-'
    }
  },
  data(): {
    quiz: Quiz | undefined
    userQuizzes: UserQuiz[]
    searchQuery: string
  } {
    return {
      quiz: undefined,
      userQuizzes: [],
      searchQuery: ''
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
