<style scoped lang="scss">
.options-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  width: 100%;
}
</style>
<template>
  <v-item-group v-if="options && quizData" v-model="selected" class="options-container">
    <AppExamQuestionLoader v-if="loading" />

    <v-item v-for="option in sortedOptions" :key="option.id" v-slot="{ active, toggle }">
      <v-card
        elevation="1"
        :dark="active"
        :color="getCardColor(option)"
        :disabled="review"
        class="align-center d-flex mb-3"
        @click="toggle"
        @keyup.enter="toggle"
      >
        <v-icon class="ml-4 my-4">
          {{ isSelected(option.id) ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
        </v-icon>

        <span class="d-block pa-4" style="width: calc(100% - 3.5rem)">
          {{ option.option }}
        </span>
      </v-card>
    </v-item>
  </v-item-group>
</template>

<script lang="ts">
import { mapWritableState } from 'pinia'
import { useExamStore } from '@/components/app/exam/examStore'
import { useMainStore } from '@/stores/main'
import { UserQuizUpdateAnswerMutation } from '@/gql/mutations/userQuiz'
import type { Option } from '@nzpmc-exam-portal/common'
import type { PropType } from 'vue'
import { GetQuizInfoQuery } from '@/gql/queries/quiz'

export default {
  name: 'AppExamQuestionOptions',
  components: {
    AppExamQuestionLoader: () => import('./Loader.vue')
  },
  props: {
    review: Boolean,
    // Unselected answers
    options: {
      type: Object as PropType<Option[]>,
      required: true,
      validator(v: Option[]) {
        return v.every(
          (option: Option) =>
            'id' in option &&
            typeof option.id === 'string' &&
            'option' in option &&
            typeof option.option === 'string'
        )
      }
    },

    // ID of the user's current answer
    answer: {
      required: true,
      validator(v: String | null) {
        return typeof v === 'string' || v === null
      }
    },

    questionNumber: { type: Number, required: true },
    questionId: { type: String, required: true },
    quizId: { type: String, required: true }
  },

  data() {
    return {
      selected: null as any,
      quizData: true as any
    }
  },

  computed: {
    // Get state from Pinia store
    ...mapWritableState(useExamStore, ['unresolvedQuestionPromises']),
    ...mapWritableState(useMainStore, ['snackbarQueue']),

    // Sorted options and answer
    sortedOptions(): Option[] {
      return [...this.options].sort((a, b) => (a.id > b.id ? 1 : -1))
    }
  },
  apollo: {
    quiz: {
      query: GetQuizInfoQuery,
      skip() {
        return !this.review
      },
      variables() {
        return {
          quizId: this.quizId
        }
      },
      result({ data, error }) {
        if (error) {
          console.log('The answer ID is most likely invalid')
        }

        if (data && this.review) {
          this.quizData = data.quiz
        }
      }
    }
  },

  watch: {
    // Ensure the selected state is synced with the server
    answer: {
      handler(v) {
        this.setSelected(v)
      },

      immediate: true
    },

    // Update server with new selected value
    selected(v) {
      // Cancel if answer has not been changed or user is in review mode
      if (this.sortedOptions[v].id === this.answer || this.review) return
      const mutation = this.$apollo.mutate({
        mutation: UserQuizUpdateAnswerMutation,
        variables: {
          input: {
            userQuizID: this.$route.params.quizID,
            questionID: this.$route.params.questionID,
            answerID: v >= 0 ? this.sortedOptions[v].id : ''
          }
        }
      })

      // Record mutation in unresolved store, so AppExamTopbarSpinner shows spinner until resolved
      this.unresolvedQuestionPromises.push(mutation)

      mutation
        .catch(() => {
          this.snackbarQueue.push(
            `An error occured when saving your answer for Question ${this.questionNumber}. Please check your connection and try again.`
          )
        })
        .finally(() => {
          // Ensure selected state is synced with server
          console.log('Success')
          console.log(this.answer)
          this.setSelected(this.answer)
        })
    }
  },

  methods: {
    // Ensure the selected state is synced with the server
    setSelected(answerID: any) {
      this.selected = this.sortedOptions.findIndex((option) => option.id === answerID)
    },

    // Check if an option is selected
    isSelected(optionId: string): boolean {
      return this.selected === this.sortedOptions.findIndex((option) => option.id === optionId)
    },

    getCardColor(option: any) {
      if (this.review) {
        try {
          const currentQuestion = this.quizData.questions.find(
            (question: any) => question.id === this.questionId
          )
          if (option.id == currentQuestion.answerID) {
            return 'green'
          } else if (option.id == this.answer) {
            return 'red-darken-4'
          } else {
            return 'white'
          }
        } catch {
          // now you might be thinking this may seem redundant
          // but it isn't - Aaron
          // (if there is an error it recalls the function)
        }
      } else {
        return option ? 'white' : '#03a9f5'
      }
    }
  }
}
</script>
