<style scoped lang="scss">
.question-container {
  justify-self: flex-end;
  width: 100vw;
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
    <div v-if="questionData" class="question-container" style="overflow-y: auto">
      <v-container fluid>
        <v-row>
          <v-col>
            <DisplayText :text="questionData.question" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" class="mb-n3">
            <div class="align-center d-flex mb-3">
              <h2 class="flex-grow-1 text-h5" style="line-height: 1">
                Question {{ questionNumber }}
              </h2>

              <AppExamQuestionFlagButton
                :flagged="questionData.flag"
                :question-number="questionNumber"
              />
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <AppExamQuestionOptions
              :options="questionData.options"
              :answer="questionData.userAnswer ? questionData.userAnswer.id : null"
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
