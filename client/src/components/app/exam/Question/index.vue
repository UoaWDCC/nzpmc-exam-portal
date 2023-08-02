<style scoped lang="scss">
.question-container {
  justify-self: flex-end;
  #next-question-button {
    background-color: $examDarkBlue;
    color: $white;
    margin: auto;
  }
}
</style>
<template>
  <template v-if="loading">
    <AppExamQuestionLoader />
  </template>

  <v-scroll-y-reverse-transition>
    <v-alert v-if="error" type="error" class="ma-3">
      {{ error }}
    </v-alert>
  </v-scroll-y-reverse-transition>

  <v-scroll-y-reverse-transition>
    <v-container fluid v-if="questionData" class="question-container">
      <v-row>
        <h2 class="flex-grow-1 text-h5" style="line-height: 1">Question {{ questionNumber }}</h2>
      </v-row>
      <v-row>
        <v-col>
          <DisplayText :text="questionData.question" />
        </v-col>
      </v-row>
      <v-row>
        <div class="align-center d-flex mb-3">
          <AppExamQuestionFlagButton
            :flagged="questionData.flag"
            :question-number="questionNumber"
          />
        </div>
      </v-row>
      <v-row>
        <AppExamQuestionOptions
          :options="questionData.options"
          :answer="questionData.userAnswer ? questionData.userAnswer.id : null"
          :question-number="questionNumber"
        />
      </v-row>
      <v-row>
        <v-btn id="next-question-button" variant="flat">Next Question</v-btn>
      </v-row>
    </v-container>
  </v-scroll-y-reverse-transition>
</template>

<script lang="ts">
import { UserQuizFullQuestionQuery, UserQuizQuery } from '@/gql/queries/userQuiz'
import AppExamQuestionOptions from './Options.vue'
import AppExamQuestionFlagButton from './FlagButton.vue'
import AppExamQuestionLoader from './Loader.vue'
import DisplayText from '@/components/app/DisplayText.vue'

export default {
  name: 'AppExamQuestion',

  components: {
    AppExamQuestionOptions,
    AppExamQuestionFlagButton,
    AppExamQuestionLoader,
    DisplayText
  },

  data(): {
    loading: boolean
    error: any
    questionData: any
    quizData: any
  } {
    return {
      loading: false,
      error: null,
      questionData: undefined,
      quizData: undefined
    }
  },

  computed: {
    questionNumber() {
      if (this.quizData) {
        const questionID = this.$route.params.questionID
        return this.quizData.questions.findIndex((question) => question.id === questionID) + 1
      }

      return null
    }
  },

  apollo: {
    questionData: {
      query: UserQuizFullQuestionQuery,
      variables() {
        return {
          quizID: this.$route.params.quizID,
          questionID: this.$route.params.questionID
        }
      },
      loadingKey: 'loading',
      result({ data, error, loading }) {
        this.loading = loading
        if (error) {
          this.error = error.message
        } else {
          if (data) {
            this.questionData = data.userQuiz.question
            console.log(this.questionData)
          }
        }
      },
      fetchPolicy: 'cache-and-network'
    },
    quizData: {
      query: UserQuizQuery,
      variables() {
        return {
          quizID: this.$route.params.quizID
        }
      },
      result({ data, error, loading }) {
        this.loading = loading
        if (error) {
          this.error = error.message
        } else {
          if (data) this.quizData = data.userQuiz
        }
      },
      fetchPolicy: 'cache-and-network'
    }
  }
}
</script>
