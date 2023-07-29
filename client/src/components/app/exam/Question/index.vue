<template>
  <template v-if="loading">
    <AppExamQuestionLoader />
  </template>

  <v-scroll-y-reverse-transition>
    <v-alert v-if="error" type="error" class="ma-3">
      {{ $errorMessage }}
    </v-alert>
  </v-scroll-y-reverse-transition>

  <v-scroll-y-reverse-transition>
    <div v-if="data" class="fill-height flex-grow-1" style="overflow-y: auto">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6" class="mb-n3">
            <div class="align-center d-flex mb-3">
              <h2 class="flex-grow-1 text-h5" style="line-height: 1">
                Question {{ questionNumber }}
              </h2>

              <AppExamQuestionFlagButton :flagged="data.flag" :question-number="questionNumber" />
            </div>

            <DisplayText :text="data.question" />
          </v-col>

          <v-col cols="12" md="6">
            <AppExamQuestionOptions
              :options="data.options"
              :answer="data.userAnswer ? data.userAnswer.id : null"
              :question-number="questionNumber"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
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
      questionData: null,
      quizData: null
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
      error(error) {
        this.error = error.message
      },
      update: (data) => data.userQuiz.question,
      fetchPolicy: 'cache-first'
    },
    quizData: {
      query: UserQuizQuery,
      variables() {
        return {
          quizID: this.$route.params.quizID
        }
      },
      fetchPolicy: 'cache-only'
    }
  }
}
</script>
