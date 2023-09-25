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
        :color="active ? '#03a9f5' : 'white'"
        :ripple="!isAdminAndEditing"
        class="align-center d-flex mb-3"
        @click="!isAdminAndEditing ? toggle : handleCorrectAnswerChange(option.id, $event)"
        @keyup.enter="!isAdminAndEditing && toggle"
      >
        <h3 v-if="isAdminAndEditing" class="ml-4 my-4">{{ index + 1 }}.</h3>
        <v-icon v-else class="ml-4 my-4">
          {{ isSelected(option.id) ? 'mdi-check-circle' : 'mdi-checkbox-blank-circle-outline' }}
        </v-icon>

        <span class="d-block pa-4" style="width: calc(100% - 3.5rem)">
          <v-text-field
            variant="underlined"
            @change="handleOptionDescriptionChange(option.id, $event)"
            :model-value="option.option"
            v-if="isAdminAndEditing"
          ></v-text-field>
          <span v-else>{{ option.option }}</span>
        </span>
        <v-icon v-if="isAdminAndEditing" color="accent" class="mr-4 my-4">
          {{ option.id === correctAnswerID ? 'mdi-check-circle' : '' }}
        </v-icon>
      </v-card>
    </v-item>
    <v-item>
      <v-card
        elevation="1"
        :dark="active"
        :color="active ? '#03a9f5' : 'white'"
        :ripple="!isAdminAndEditing"
        class="align-center d-flex mb-3"
        @click="addNewOption"
        @keyup.enter="!isAdminAndEditing && toggle"
        :disabled="updating"
      >
        <v-icon class="ml-4 my-4">
          {{ 'mdi-plus-circle' }}
        </v-icon>
        <span class="d-block pa-4" style="width: calc(100% - 3.5rem)"> Add New Question </span>
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
import { AddOptionMutation, EditAnswerMutation } from '@/gql/mutations/quizQuestion'
import { debounce } from '@/utils/quizManagement'

export default {
  name: 'AppExamQuestionOptions',

  mixins: [quizEditingMixin],
  props: {
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

    questionNumber: { type: Number, required: true }
  },

  data() {
    return {
      selected: null as any,
      updating: false
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
      // Cancel if answer has not been changed
      if (this.sortedOptions[v].id === this.answer) return

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
        })
    }
  },

  methods: {
    async handleOptionDescriptionChange(optionID: string, event: Event) {
      const currentDescription: string = event.target.value
      const debouncedEdit = debounce(this.editQuestionOptionInfo)

      const res = await debouncedEdit(this.$apollo.getClient(), {
        id: optionID,
        questionID: this.questionID,
        quizID: this.quizID,
        optionDescription: currentDescription
      })
      if (res) this.$emit('option-changed')
    },
    async handleCorrectAnswerChange(optionID: string, event: Event) {
      this.updating = true
      if (optionID === this.correctAnswerID) {
        return
      }
      await this.$apollo.mutate({
        mutation: EditAnswerMutation,
        variables: {
          input: {
            newAnswerOptionID: optionID,
            questionID: this.questionID,
            quizID: this.quizID
          }
        }
      })
      this.$emit('option-changed')
      this.updating = false
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
      this.$emit('option-changed')
      this.updating = false
    },
    // Ensure the selected state is synced with the server
    setSelected(answerID: any) {
      this.selected = this.sortedOptions.findIndex((option) => option.id === answerID)
    },

    // Check if an option is selected
    isSelected(optionId: string): boolean {
      return this.selected === this.sortedOptions.findIndex((option) => option.id === optionId)
    }
  }
}
</script>
