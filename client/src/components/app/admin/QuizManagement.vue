<template>
  <v-dialog v-model="popUpDialog" class="popup-dialog">
    <v-card>
      <v-card-title class="popup-headline">NZPMC Admin</v-card-title>
      <v-card-text class="popup-text">
        <div class="custom-progress">
          <v-progress-circular
            v-if="loading"
            :size="100"
            :width="15"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <!-- <temp> -->

          <template v-else>
            {{ popUpMessage }}
          </template>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="popUpDialog = false" class="popup-button">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container class="quiz-management" fluid>
    <v-container fluid>
      <v-select
        label="SELECT AN EXAM"
        :items="quizzes"
        item-title="name"
        item-value="id"
        @update:model-value="updateQuizID"
      ></v-select>

      <v-btn size="large" color="secondary">
        ADD NEW EXAM
        <v-icon end icon="mdi-plus-box-outline"></v-icon>
      </v-btn>
    </v-container>

    <v-container fluid class="mt-8 bg-grey-lighten-2 pa-10">
      <div class="d-flex mb-5">
        <div class="me-auto">
          <h2>
            EXAM: <span class="text-h6 ml-2">{{ quizName }}</span>
          </h2>
          <p><b>Last Modified: </b>{{ quizLastModified }}</p>
        </div>
        <v-text-field
          label="ID"
          :model-value="quizIdInput"
          class="id-input"
          density="comfortable"
          readonly
        ></v-text-field>
      </div>
      <v-text-field
        label="Exam Name"
        @change="handleNameChange"
        :model-value="quizName"
      ></v-text-field>
      <v-textarea
        label="Description"
        auto-grow
        @change="handleDescriptionChange"
        :model-value="quizDescription"
        rows="3"
        clearable
      ></v-textarea>

      <v-divider :thickness="3" class="pa-5" />

      <v-text-field
        type="number"
        @change="handleDurationChange"
        label="Exam Time (minutes)"
        :model-value="quizDurationMinutes"
      ></v-text-field>

      <v-divider :thickness="3" class="pa-5" />

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Start Date"
            prepend-inner-icon="mdi-calendar-range"
            :model-value="quizStartDate"
          ></v-text-field>
          <v-text-field
            label="Start Time"
            prepend-inner-icon="mdi-clock-time-eight-outline"
            :model-value="quizStartTime"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="End Date"
            :model-value="quizEndDate"
            prepend-inner-icon="mdi-calendar-range"
          ></v-text-field>
          <v-text-field
            label="End Time"
            prepend-inner-icon="mdi-clock-time-eight-outline"
            :model-value="quizEndTime"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-container fluid class="px-0">
        <v-btn size="large" color="blue-darken-2"
          >EDIT QUESTIONS<v-icon end icon="mdi-cog"></v-icon
        ></v-btn>
      </v-container>

      <v-container fluid class="px-0 mt-5">
        <v-btn @click="enrollUserIntoQuiz" block size="large" color="white"
          >ENROLL STUDENTS TO EXAM (UPLOAD CSV)<v-icon end icon="mdi-paperclip"></v-icon
        ></v-btn>
        <v-btn @click="downloadUserQuizzes" block size="large" color="blue-darken-2" class="mt-3"
          >DOWNLOAD USERS CSV OF CURRENT EXAM</v-btn
        >
      </v-container>

      <v-container fluid class="px-0 mt-5">
        <v-btn block size="large" color="secondary">GRADE EXAM</v-btn>
        <v-btn block size="large" color="secondary" class="mt-3">RELEASE RESULTS</v-btn>
      </v-container>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { User } from '@/components/app/admin/UserManagement.vue'
import { AllQuizIDQuery } from '@/gql/queries/quiz'
import {
  debounce,
  downloadUserQuizzesCsvQuery,
  editQuizMutation,
  getQuizInfoQuery
} from '@/utils/quizManagement'
import type { QuizModel } from '@nzpmc-exam-portal/common'

export type UserQuiz = {
  user: User
  score: number
}

export default defineComponent({
  name: 'QuizManagement',

  data() {
    return {
      quizzes: [],
      quizIdInput: '',
      loading: false,
      popUpDialog: false,
      popUpMessage: '',
      selectedQuiz: undefined as QuizModel
    }
  },

  apollo: {
    userQuizzes: {
      query: AllQuizIDQuery,
      result({ data, error, loading }) {
        this.loading = loading
        if (error) {
          this.error = error.message
        } else {
          if (data) {
            this.quizzes = data.quizzes
          }
        }
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    }
  },
  computed: {
    quizName() {
      return this.quizzes.find((quiz) => quiz.id === this.quizIdInput)?.name ?? '(no exam selected)'
    },
    quizDescription() {
      return this.selectedQuiz ? this.selectedQuiz.description : ``
    },
    quizDurationMinutes() {
      return this.selectedQuiz ? this.selectedQuiz.duration / 60 : ``
    },

    quizStartDate() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.startTime)
        return date.toDateString()
      }
      return ``
    },
    quizEndDate() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.endTime)
        return date.toDateString()
      }
      return ``
    },
    quizStartTime() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.startTime)
        return date.toTimeString()
      }
      return ``
    },
    quizEndTime() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.endTime)
        return date.toTimeString()
      }
      return ``
    },
    quizLastModified() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.modified)
        return date.toLocaleString()
      }
      return `(no exam selected)`
    }
  },
  methods: {
    updateQuizID(id) {
      this.quizIdInput = id
      this.fetchQuizInfo()
    },
    handleDescriptionChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        this.editAndUpdateSelectedQuiz({ description: currentValue })
      }
    },
    handleNameChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        this.editAndUpdateSelectedQuiz({ name: currentValue })
      }
    },
    handleDurationChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        // multiply by 60 to convert to seconds
        this.editAndUpdateSelectedQuiz({ duration: 60 * parseInt(currentValue) })
      }
    },
    editAndUpdateSelectedQuiz(input: {
      description?: string
      duration?: number
      endTime?: Date
      name?: string
      startTime?: Date
    }) {
      const debouncedDurationEdit = debounce(editQuizMutation)
      debouncedDurationEdit(this.$apollo, this.quizIdInput, input).then((res: any) => {
        console.log(res)
        this.selectedQuiz = { ...this.selectedQuiz, modified: res.modified }
        if (input.name !== undefined) {
          this.$apollo.queries.userQuizzes.refetch()
        }
      })
    },
    async enrollUserIntoQuiz() {
      try {
        // TODO: Add your logic to enroll a user into the quiz here
        console.log('User enrolled into the quiz')
      } catch (error) {
        console.error('Failed to enroll user into the quiz:', error)
      }
    },

    async fetchQuizInfo() {
      try {
        const quiz = await getQuizInfoQuery(this.$apollo, this.quizIdInput)
        this.selectedQuiz = quiz
      } catch (error) {}
    },

    async downloadUserQuizzes() {
      try {
        const success = await downloadUserQuizzesCsvQuery(this.$apollo, this.quizIdInput) // waits for the query to finish

        this.popUpMessage = 'Downloaded user quizzes for quiz id: ' + this.quizIdInput
        if (!success) {
          this.popUpMessage = 'Failed to download user quizzes for quiz id: ' + this.quizIdInput
        }

        this.popUpDialog = true
      } catch (error) {
        console.error('Failed to download user quizzes:', error)

        this.popUpMessage = 'Failed to download user quizzes for quiz id: ' + this.quizIdInput
        this.popUpDialog = true
      }
    }
  }
})
</script>

<style scoped lang="scss">
.id-input {
  max-width: 18rem;
}

.container .v-divider {
  margin-top: 2rem;
}

.quiz-management {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* Updated to left-aligned */
}

.quiz-management h2 {
  margin-bottom: 1rem;
}

.quiz-management v-btn {
  margin-bottom: 1rem;
}

.quiz-management .text-field {
  width: 100%;
  margin: 1rem 0;
  /* Added spacing above and below the input box */
}

.quiz-management v-divider {
  margin-top: 2rem;
}
</style>
