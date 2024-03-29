<style scoped lang="scss">
.options-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
  width: 100%;
}
</style>
<template>
  <v-item-group v-model="selected" class="options-container">
    <v-item v-for="(option, index) in sortedOptions" :key="option.id" v-slot="{ active, toggle }">
      <v-card
        elevation="1"
        :dark="active"
        :color="getCardColor(option)"
        :ripple="!isAdminAndEditing"
        :disabled="updating || review"
        class="align-center d-flex mb-3"
        @click="!isAdminAndEditing && setSelected(option.id)"
        @keyup.enter="!isAdminAndEditing && toggle"
      >
        <h3 v-if="isAdminAndEditing" class="ml-4 my-4">{{ index + 1 }}.</h3>
        <v-icon v-else class="ml-4 my-4">
          {{ isSelected(option.id) ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
        </v-icon>

        <span class="d-block pa-4" style="width: calc(100% - 3.5rem)">
          <v-text-field
            :hint="'Modified: ' + option.modified"
            persistent-hint
            variant="underlined"
            @change="handleOptionDescriptionChange(option.id, $event)"
            :model-value="option.option"
            v-if="isAdminAndEditing"
          ></v-text-field>
          <span v-else>{{ option.option }}</span>
        </span>
        <v-btn
          elevation="0"
          v-if="isAdminAndEditing"
          v-on:click="deleteOption(option.id)"
          color="red"
          icon="mdi-close"
          class="mr-4 my-4"
        />
        <v-btn
          elevation="0"
          v-if="isAdminAndEditing"
          v-on:click="handleCorrectAnswerChange(option.id)"
          :color="isCorrectAnswer(option.id) ? 'accent' : 'secondary'"
          :icon="isCorrectAnswer(option.id) ? 'mdi-check-circle' : 'mdi-cancel'"
          class="mr-4 my-4"
        />
      </v-card>
    </v-item>
    <v-item v-if="isAdminAndEditing">
      <v-card
        elevation="1"
        :ripple="!isAdminAndEditing"
        class="align-center d-flex mb-3"
        @click="addNewOption"
        :disabled="updating"
      >
        <v-icon class="ml-4 my-4">
          {{ 'mdi-plus-circle' }}
        </v-icon>
        <span class="d-block pa-4" style="width: calc(100% - 3.5rem)">Add New Answer</span>
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
import quizEditingMixin from '@/utils/quizEditingMixin'
import { GetQuizInfoQuery } from '@/gql/queries/quiz'
import {
  AddOptionMutation,
  DeleteOptionMutation,
  EditAnswerMutation
} from '@/gql/mutations/quizQuestion'
import { debounce } from '@/utils/quizManagement'

export default {
  name: 'AppExamQuestionOptions',
  emits: ['correct-answer-changed', 'user-question-changed', 'option-changed', 'ready-to-fetch'],
  mixins: [quizEditingMixin],
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
    correctAnswerID: {
      required: false
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
      updating: false,
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
      if (this.isAdminNotSittingExam) {
        return
      }
      if (!this.sortedOptions[v]) return
      const selectedID = this.sortedOptions[v].id
      // Cancel if answer has not been changed
      if (selectedID === this.answer || this.review) return

      this.$emit('user-question-changed', { questionID: this.questionID, userAnswerID: selectedID })
      const mutation = this.$apollo.mutate({
        mutation: UserQuizUpdateAnswerMutation,
        variables: {
          input: {
            userQuizID: this.$route.params.quizID,
            questionID: this.$route.params.questionID,
            answerID: v >= 0 ? selectedID : ''
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
          this.$emit('ready-to-fetch')
        })
        .finally(() => {
          // Ensure selected state is synced with server
          console.log('Success')
        })
    }
  },

  methods: {
    isCorrectAnswer(optionID: string) {
      return optionID === this.correctAnswerID
    },
    async handleOptionDescriptionChange(optionID: string, event: Event) {
      const currentDescription: string = event.target.value
      const debouncedEdit = debounce(this.editQuestionOptionInfo)

      this.$emit('option-changed', { optionID: optionID, optionDescription: currentDescription })
      const res = await debouncedEdit(this.$apollo.getClient(), {
        id: optionID,
        questionID: this.questionID,
        quizID: this.quizID,
        optionDescription: currentDescription
      })
      if (res) {
        this.$emit('ready-to-fetch')
      }
    },
    async deleteOption(optionID: string) {
      this.updating = true
      await this.$apollo.mutate({
        mutation: DeleteOptionMutation,
        variables: {
          quizID: this.quizID,
          questionID: this.questionID,
          optionID
        }
      })
      this.$emit('ready-to-fetch')
      this.updating = false
    },
    async handleCorrectAnswerChange(optionID: string) {
      let newCorrectAnswerOptionID = optionID
      if (this.isCorrectAnswer(optionID)) {
        newCorrectAnswerOptionID = 'none-selected'
      }
      this.$emit('correct-answer-changed', {
        questionID: this.questionID,
        correctAnswerID: newCorrectAnswerOptionID
      })
      await this.$apollo.mutate({
        mutation: EditAnswerMutation,
        variables: {
          input: {
            newAnswerOptionID: newCorrectAnswerOptionID,
            questionID: this.questionID,
            quizID: this.quizID
          }
        }
      })
      //this.$emit('ready-to-fetch')
    },
    async addNewOption() {
      this.updating = true
      await this.$apollo.mutate({
        mutation: AddOptionMutation,
        variables: {
          input: {
            option: 'New Option',
            questionID: this.questionID,
            quizID: this.quizID
          }
        }
      })
      this.$emit('ready-to-fetch')
      this.updating = false
    },
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
