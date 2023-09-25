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
        <v-btn variant="flat" color="red" v-on:click="deleteCurrentQuestion">delete</v-btn>
      </v-row>
      <v-row>
        <v-col>
          <DisplayText :text="question.question" />
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
          @option-changed="fetchData('network-only')"
          :options="question.options"
          :answer="question.userAnswer ? question.userAnswer.id : null"
          :correctAnswerID="isAdminAndEditing ? question.answerID : null"
          :question-number="questionNumber"
        />
        <v-btn id="next-question-button" v-on:click="nextQuestion()" variant="flat"
          >Next Question</v-btn
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

export default {
  name: 'AppExamQuestion',
  mixins: [quizEditingMixin],

  components: {
    AppExamQuestionOptions,
    AppExamQuestionFlagButton,
    DisplayText
  },

  data() {
    return {
      error: null,
      quizData: undefined
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
    async deleteCurrentQuestion() {
      try {
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
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  watch: {
    'quizData.questions': function () {
      this.fetchData('network-only')
    }
  },

  created() {
    onMounted(async () => {
      this.fetchData('cache-first')
    })
  }
}
</script>
