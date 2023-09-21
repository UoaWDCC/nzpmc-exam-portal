<style scoped lang="scss">
.question-container {
  overflow-y: auto;
  overflow-x: hidden;
  justify-self: flex-end;
  padding-bottom: 0;

  #next-question-button {
    background-color: $examDarkBlue;
    color: $white;
    margin: auto;
  }

  #submit-button {
    background-color: $secondary;
    color: $white;
    margin: auto;
  }

  .options-area {
    display: flex;
    flex-direction: column;
    background: $grey;
    padding: 32px;
    margin: 0 -32px;
  }
}
</style>
<template>
  <v-scroll-y-reverse-transition>
    <v-alert v-if="error" type="error" class="ma-3">
      {{ error }}
    </v-alert>
  </v-scroll-y-reverse-transition>

  <v-scroll-y-reverse-transition>
    <v-container fluid v-if="quizData" class="question-container">
      <v-row>
        <h2 class="flex-grow-1 text-h5" style="line-height: 1">Question {{ questionNumber }}</h2>
      </v-row>
      <v-row>
        <v-col>
          <DisplayText :text="question.question" />
        </v-col>
      </v-row>
      <v-row>
        <div class="align-center d-flex mb-3">
          <AppExamQuestionFlagButton :flagged="question.flag" :question-number="questionNumber" />
        </div>
      </v-row>
      <div class="options-area">
        <AppExamQuestionOptions :options="question.options" :answer="question.userAnswer ? question.userAnswer.id : null"
          :question-number="questionNumber" />
        <v-btn id="next-question-button" v-on:click="nextQuestion()" variant="flat">Next Question</v-btn>
        <v-btn id="submit-button" v-on:click="submitQuiz()" variant="flat">Submit Exam</v-btn>
      </div>
    </v-container>
  </v-scroll-y-reverse-transition>
</template>

<script lang="ts">
import { UserQuizQuery } from '@/gql/queries/userQuiz'
import AppExamQuestionOptions from './Options.vue'
import AppExamQuestionFlagButton from './FlagButton.vue'
import DisplayText from '@/components/app/DisplayText.vue'
import type { Question } from '@nzpmc-exam-portal/common'
import { SubmitUserQuizQuestionsMutation } from '@/gql/mutations/userQuiz'
import { useExamStore } from '../examStore'
import type { Store } from 'pinia'

export default {
  name: 'AppExamQuestion',

  components: {
    AppExamQuestionOptions,
    AppExamQuestionFlagButton,
    DisplayText
  },
  data(): {
    error: any
    quizData: any
    examStore: any
  } {
    return {
      error: null,
      quizData: undefined,
      examStore: useExamStore()
    }
  },
  computed: {
    questionNumber() {
      if (this.quizData) {
        const questionID = this.$route.params.questionID
        return (
          this.quizData.questions.findIndex((question: Question) => question.id === questionID) + 1
        )
      }
      return null
    },
    question() {
      if (this.quizData) {
        const questionID = this.$route.params.questionID
        const question = this.quizData.questions.find(
          (question: Question) => question.id === questionID
        )
        console.log(question)
        return question
      }

      return null
    }
  },
  methods: {
    nextQuestion() {
      if (this.questionNumber) {
        const nextQuestionIndex = this.questionNumber // index will use exact same value because it has 1 added to it
        const nextQuestionID = this.quizData.questions[nextQuestionIndex].id
        console.log(nextQuestionID)
        this.$router.push({
          name: 'AppExamQuestion',
          params: { quizID: this.$route.params.quizID, questionID: nextQuestionID }
        })
      }
    },
    submitQuiz() {
      console.log('clicek')
      const mutation = this.$apollo.mutate({
        mutation: SubmitUserQuizQuestionsMutation,
        variables: {
          input: {
            userQuizID: this.$route.params.quizID
          }
        }
      })
      this.examStore.submitting = true
      mutation
        .then(() => {
          this.$router.push({
            name: 'AppExams'
          })
        })
        .catch(() => {
          this.snackbarQueue.push(`Unable to submit exam. Please try again later.`)
        })
    }
  },

  apollo: {
    quizData: {
      query: UserQuizQuery,
      variables() {
        return {
          quizID: this.$route.params.quizID
        }
      },
      result({ data, error }) {
        if (error) {
          this.error = error.message
        } else {
          if (data) this.quizData = data.userQuiz
        }
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true
    }
  }
}
</script>
