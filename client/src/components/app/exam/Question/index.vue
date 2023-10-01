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
        <v-btn
          v-if="isAdminAndEditing"
          variant="flat"
          color="red"
          :disabled="updating"
          v-on:click="deleteCurrentQuestion"
          >delete</v-btn
        >
      </v-row>
      <v-row>
        <v-col>
          <DisplayText
            @question-changed="storeQuestionChangesLocally"
            @ready-to-fetch="fetchData('network-only')"
            :text="question.question"
          />
        </v-col>
      </v-row>
      <v-row>
        <div class="align-center d-flex mb-3">
          <AppExamQuestionFlagButton
            v-if="!isAdminAndEditing"
            @flag-changed="$emit('flag-changed')"
            :flagged="question.flag"
            :question-number="questionNumber"
          />
        </div>
      </v-row>
      <div class="options-area">
        <AppExamQuestionOptions
          @option-changed="storeOptionChangesLocally"
          @correct-answer-changed="storeQuestionChangesLocally"
          @user-answer-changed="storeQuestionChangesLocally"
          @ready-to-fetch="fetchData('network-only')"
          :options="question.options"
          :answer="question.userAnswer ? question.userAnswer.id : null"
          :correctAnswerID="isAdminAndEditing ? question.answerID : null"
          :question-number="questionNumber"
        />
        <v-btn
          v-if="questionNumber < quizData.questions.length"
          id="next-question-button"
          v-on:click="nextQuestion()"
          variant="flat"
          >Next Question</v-btn
        >
        <v-btn v-else id="submit-button" v-on:click="submitQuiz()" variant="flat"
          >Submit Exam</v-btn
        >
      </div>
    </v-container>
  </v-scroll-y-reverse-transition>
</template>

<script lang="ts">
import AppExamQuestionOptions from './Options.vue'
import AppExamQuestionFlagButton from './FlagButton.vue'
import DisplayText from '@/components/app/DisplayText.vue'
import type { Question } from '@nzpmc-exam-portal/common'
import quizEditingMixin from '@/utils/quizEditingMixin'
import { onMounted } from 'vue'
import { SubmitUserQuizQuestionsMutation } from '@/gql/mutations/userQuiz'
import { useExamStore } from '../examStore'

export default {
  name: 'AppExamQuestion',
  mixins: [quizEditingMixin],

  components: {
    AppExamQuestionOptions,
    AppExamQuestionFlagButton,
    DisplayText
  },
  data(): {
    error: any
    quizData: any
    examStore: any
    updating: boolean
  } {
    return {
      error: null,
      quizData: undefined,
      updating: false,
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
        return question
      }

      return null
    }
  },

  methods: {
    storeQuestionChangesLocally(inputs: {
      questionID: string
      questionDescription?: string
      correctAnswerID?: string
      userAnswerID?: string
    }) {
      const { questionID, questionDescription, correctAnswerID, userAnswerID } = inputs
      const temporaryQuizData = JSON.parse(JSON.stringify(this.quizData))
      const questionIndex = temporaryQuizData.questions.findIndex(
        (question: Question) => question.id === questionID
      )
      if (questionDescription) {
        const localQuestionDescription = questionDescription
        temporaryQuizData.questions[questionIndex].question = localQuestionDescription
      }

      if (correctAnswerID) {
        temporaryQuizData.questions[questionIndex].answerID = correctAnswerID
      }

      if (userAnswerID) {
        temporaryQuizData.questions[questionIndex].userAnswer.id = userAnswerID
      }

      this.quizData = temporaryQuizData
      localStorage.setItem(`${this.quizID}`, JSON.stringify(this.quizData))
    },
    storeOptionChangesLocally(inputs: { optionID: string; optionDescription?: string }) {
      if (inputs) {
        const { optionID } = inputs
        const localOptionDescription = inputs.optionDescription
        const temporaryQuizData = JSON.parse(JSON.stringify(this.quizData))

        let questionIndex = -1
        let optionIndex = -1

        for (let i = 0; i < temporaryQuizData.questions.length; i++) {
          const question = temporaryQuizData.questions[i]
          for (let j = 0; j < question.options.length; j++) {
            const option = question.options[j]
            if (option.id === optionID) {
              option.option = localOptionDescription

              questionIndex = i
              optionIndex = j

              break
            }
          }
          if (optionIndex !== -1) {
            break
          }
        }

        if (localOptionDescription) {
          temporaryQuizData.questions[questionIndex].options[optionIndex].option =
            localOptionDescription
        }

        this.quizData = temporaryQuizData
        localStorage.setItem(`${this.quizID}`, JSON.stringify(this.quizData))
      }
    },
    async deleteCurrentQuestion() {
      try {
        this.updating = true
        await this.deleteQuestion(this.$apollo.getClient(), {
          quizID: this.quizID,
          questionID: this.questionID
        })
      } finally {
        this.$emit('question-deleted')
        this.$router.push({
          name: 'AppExam',
          params: {
            quizID: this.quizID
          },
          query: this.uriQueryType
        })
        this.updating = false
      }
    },
    async nextQuestion() {
      if (this.questionNumber) {
        const nextQuestionIndex = this.questionNumber // subtract 1 to get the correct index
        const nextQuestionID = this.quizData.questions[nextQuestionIndex].id
        console.log(nextQuestionID)
        this.$router.push({
          name: 'AppExamQuestion',
          query: this.isEditingQuizQuery,
          params: { quizID: this.$route.params.quizID, questionID: nextQuestionID }
        })
      }
    },
    submitQuiz() {
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
    },

    async fetchData(fetchPolicy: 'network-only' | 'cache-first') {
      const quizId = this.$route.params.quizID
      try {
        const { data } = await this.$apollo.query({
          query: this.queryType,
          variables: this.isAdminNotSittingExam ? { quizId } : { quizID: quizId },
          fetchPolicy,
          notifyOnNetworkStatusChange: true
        })

        if (data) {
          this.quizData = this.isAdminNotSittingExam ? data.quiz : data.userQuiz
          localStorage.setItem(`${this.quizID}`, JSON.stringify(this.quizData))
        }
      } catch (error) {
        console.error(error)
      }
    }
  },

  created() {
    const cachedQuiz = localStorage.getItem(`${this.quizID}`)
    if (cachedQuiz) {
      this.quizData = JSON.parse(cachedQuiz)
      return
    }
    onMounted(async () => {
      await this.fetchData('network-only')
    })
  }
}
</script>
