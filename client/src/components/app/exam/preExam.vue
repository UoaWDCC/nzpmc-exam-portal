<template>
  <AppExamQuestionLoader v-if="loading" />
  <div v-if="!loading" class="pre-exam">
    <v-btn :to="{ name: 'AppExams' }" id="back-btn" icon="mdi-arrow-left" variant="tonal"></v-btn>
    <h1>{{ examName }}</h1>
    <div class="description-section">
      <div class="description">{{ examDescription }}</div>
      <div class="exam-dates">
        <div class="date-info">
          <p>OPENS:</p>
          <p>{{ examOpenTime }}</p>
        </div>
        <div class="date-info">
          <p>CLOSES:</p>
          <p>{{ examCloseTime }}</p>
        </div>
      </div>
    </div>

    <div v-if="!examCompleted" class="start-section">
      <!-- Renders if exam is not completed -->
      <h3 id="exam-duration">Exam Duration: {{ examDuration }}</h3>
      <v-btn :to="{ name: 'AppExam', params: { quizID: examID } }" id="start-btn" variant="tonal"
        >START EXAM</v-btn
      >
      <p id="exam-warning">Clicking the start button will begin the quiz timer. Good luck!</p>
    </div>

    <div v-if="examCompleted" class="start-section">
      <!-- Renders if exam is completed -->
      <h3 id="exam-duration">Time Used: {{ examTimeUsed }}</h3>

      <span v-if="examMarked" class="start-section">
        <!-- Renders if examMarked is true -->
        <h4 id="graded">GRADED:</h4>
        <h2 id="grade">{{ examScorePercentage }} {{ examScoreFraction }}</h2>
        <!-- TODO: change the path to the exam details when that is implemented -->
        <v-btn :to="{ name: 'AppExam', params: { quizID: examID } }" id="start-btn" variant="tonal"
          >VIEW DETAILS</v-btn
        >
      </span>
      <span v-else class="start-section">
        <!-- Renders if examMarked is false -->
        <h2 class="text-error">You have successfully submitted this exam. Results pending.</h2>
        <h5>If this is an error, please contact us at <u>contact@nzpmc.com</u></h5>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { UserQuizQuery } from '@/gql/queries/userQuiz'
import AppExamQuestionLoader from './Question/Loader.vue'

export default {
  name: 'AppPreExam',
  components: {
    AppExamQuestionLoader
  },
  data(): any {
    return {
      // TODO: get this information from the exam
      userQuiz: null,
      examName: '',
      examDescription: '',
      examOpenTime: '',
      examCloseTime: '',
      examDuration: '',
      examID: this.$route.params.quizID,
      examCompleted: false,
      examMarked: false,
      examTimeUsed: '',
      numberOfQuestions: 0,
      correctAnswers: 0,
      loading: true
    }
  },
  computed: {
    examScoreFraction(): string {
      return this.correctAnswers + '/' + this.numberOfQuestions
    },
    examScorePercentage(): string {
      return ((this.correctAnswers / this.numberOfQuestions) * 100).toFixed(2) + '%'
    }
  },

  apollo: {
    userQuiz: {
      query: UserQuizQuery,
      variables() {
        return {
          quizID: this.$route.params.quizID // Pass the quizID parameter
        }
      },
      result({ data, error }) {
        if (error) {
          this.error = error.message
        } else {
          if (data) {
            this.userQuiz = data.userQuiz
            sessionStorage.setItem(
              `${this.$route.params.quizID}-pre-exam`,
              JSON.stringify(this.userQuiz)
            )
          }
          this.updateExamInfo()
        }
      }
    }
  },
  mounted() {
    this.updateExamInfo()
  },

  methods: {
    updateExamInfo() {
      if (!this.userQuiz) {
        const cachedExam = sessionStorage.getItem(`${this.$route.params.quizID}-pre-exam`)
        if (cachedExam) {
          this.userQuiz = JSON.parse(cachedExam)
        }
      }
      if (this.userQuiz) {
        this.examName = this.userQuiz.name || ''
        this.examDescription = this.userQuiz.description || ''
        this.examOpenTime = this.convertToNZST(this.userQuiz.openTime) || ''
        this.examCloseTime = this.convertToNZST(this.userQuiz.closeTime) || ''
        this.examDuration = `${this.userQuiz.duration / 60} minutes` || ''
        try {
          this.examCompleted =
            this.userQuiz.submitted || this.userQuiz.closeTime < new Date().toISOString()
              ? true
              : false
        } catch {
          this.examCompleted = this.userQuiz < new Date().toISOString() ? true : false
        }
        this.examMarked = this.userQuiz.released && this.userQuiz.score !== null ? true : false

        if (this.examCompleted) {
          const hours = Math.floor(this.userQuiz.duration / 60)
          const minutes = this.userQuiz.duration % 60
          this.examTimeUsed = `${hours} hours, ${minutes} minutes` // this might be using the wrong duration?
          this.numberOfQuestions = this.userQuiz.questions.length || 0
          this.correctAnswers = this.userQuiz.score || 0
        }
        this.loading = false
      }
      this.$apollo.queries.userQuiz.refetch()
    },

    convertToNZST(isoDateString: string) {
      // Set the time zone to "Pacific/Auckland" (New Zealand Standard Time)
      const options = { timeZone: 'Pacific/Auckland' }

      // Convert the date to a string using the New Zealand time zone
      const date = new Date(isoDateString)
      const nzstDateString = date.toLocaleString('en-NZ', options).replace(',', '')

      return nzstDateString
    }
  }
}
</script>

<style scoped lang="scss">
#back-btn {
  position: absolute;
  top: 10%;
  left: 5%;
  background-color: $secondary;
  color: white;
}

.pre-exam {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  letter-spacing: 1px;
  margin-top: 10vh;
}

.pre-exam h1 {
  font-size: calc(3vmax + 1rem);
  margin: 0 0 calc(-0.5 * (3vmax + 1rem) - 0.9rem) 0;
  z-index: 1;
  font-weight: 800;
  letter-spacing: 4px;
}

.description-section {
  background-color: #f4f4f4;
  padding: 4vmax 3vmax 3vmax 3vmax;
  width: 90%;
  text-align: justify;
  color: $examDarkBlue;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 25px;
}

.exam-dates {
  display: flex;
  flex-direction: column;
  margin-top: 4vh;
  letter-spacing: 1px;
}

.date-info {
  display: flex;
}

.date-info > p {
  width: 7vw;
  min-width: fit-content;
}

.date-info > p:not(:first-child) {
  text-align: center;
  font-weight: 800;
}

.start-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#exam-duration {
  margin: 3vh 0 5vh 0;
  font-weight: 800;
}

#start-btn {
  padding: 1.5vmax 5vmax 2.5vmax 5vmax;
  background-color: $secondary;
  color: white;
  letter-spacing: 6px;
  font-weight: 800;
}

#exam-warning {
  margin-top: 2vh;
  color: $error;
}

#graded {
  font-weight: 400;
  color: $examDarkBlue;
}

#grade {
  font-weight: 800;
  font-size: calc(1vmax + 1.3rem);
  color: $examDarkBlue;
  margin-bottom: 2vh;
}
</style>
