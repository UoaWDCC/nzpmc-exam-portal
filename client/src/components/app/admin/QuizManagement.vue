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
        v-model="quizIdInput"
        label="SELECT AN EXAM"
        :items="quizzes"
        item-title="name"
        item-value="id"
        @update:model-value="updateQuizID"
      ></v-select>

      <v-btn :disabled="loading" size="large" color="secondary" @click="createAndGoToExam">
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
        :disabled="loading"
        @change="handleNameChange"
        :model-value="quizName"
      ></v-text-field>
      <v-textarea
        label="Description"
        auto-grow
        @change="handleDescriptionChange"
        :disabled="loading"
        :model-value="quizDescription"
        rows="3"
        clearable
      ></v-textarea>

      <v-divider :thickness="3" class="pa-5" />

      <v-text-field
        type="number"
        @change="handleDurationChange"
        :disabled="loading"
        label="Exam Time (minutes)"
        :model-value="quizDurationMinutes"
      ></v-text-field>

      <v-divider :thickness="3" class="pa-5" />

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            :disabled="loading"
            label="Start Date"
            type="date"
            prepend-inner-icon="mdi-calendar-range"
            @change="handleStartDateChange"
            :model-value="quizStartDate"
          ></v-text-field>
          <v-text-field
            label="Start Time"
            :disabled="loading"
            type="time"
            prepend-inner-icon="mdi-clock-time-eight-outline"
            @change="handleStartTimeChange"
            :model-value="quizStartTime"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="End Date"
            :disabled="loading"
            type="date"
            :model-value="quizEndDate"
            @change="handleEndDateChange"
            prepend-inner-icon="mdi-calendar-range"
          ></v-text-field>
          <v-text-field
            label="End Time"
            :disabled="loading"
            type="time"
            prepend-inner-icon="mdi-clock-time-eight-outline"
            @change="handleEndTimeChange"
            :model-value="quizEndTime"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-container fluid class="px-0">
        <v-btn size="large" :disabled="loading" color="blue-darken-2"
          >EDIT QUESTIONS<v-icon end icon="mdi-cog"></v-icon
        ></v-btn>
      </v-container>

      <v-container fluid class="px-0 mt-5">
        <v-btn @click="enrollUserIntoQuiz" block size="large" color="white" :disabled="loading"
          >ENROLL STUDENTS TO EXAM (UPLOAD CSV)<v-icon end icon="mdi-paperclip"></v-icon
        ></v-btn>
        <v-btn
          @click="downloadUserQuizzes"
          block
          size="large"
          color="blue-darken-2"
          class="mt-3"
          :disabled="loading"
          >DOWNLOAD USERS CSV OF CURRENT EXAM</v-btn
        >
      </v-container>

      <v-container fluid class="px-0 mt-5">
        <v-btn block size="large" :disabled="loading" color="secondary">GRADE EXAM</v-btn>
        <v-btn block size="large" :disabled="loading" color="secondary" class="mt-3"
          >RELEASE RESULTS</v-btn
        >
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
  getQuizInfoQuery,
  createEmptyExamMutation,
  formatDateToDate,
  type editQuizInput,
  formatDateToTime
} from '@/utils/quizManagement'
import type { EditQuizInput, QuizModel } from '@nzpmc-exam-portal/common'

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
        return formatDateToDate(date)
      }
      return ``
    },
    quizEndDate() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.endTime)
        return formatDateToDate(date)
      }
      return ``
    },
    quizStartTime() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.startTime)
        return formatDateToTime(date)
      }
      return ``
    },
    quizEndTime() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.endTime)
        return formatDateToTime(date)
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
    async updateQuizID(id: string) {
      this.loading = true
      this.quizIdInput = id
      await this.fetchQuizInfo()
      this.loading = false
    },
    handleDescriptionChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, { description: currentValue })
      }
    },
    handleNameChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, { name: currentValue })
      }
    },
    handleDurationChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        // multiply by 60 to convert to seconds
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, {
          duration: 60 * parseInt(currentValue)
        })
      }
    },
    handleStartDateChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        const currentStartDate = this.updateDateFromString(currentValue)
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, { startTime: currentStartDate })
      }
    },
    handleStartTimeChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        const currentStartTime = this.updateTimeFromString(currentValue)
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, { startTime: currentStartTime })
      }
    },
    handleEndTimeChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        const currentEndTime = this.updateTimeFromString(currentValue)
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, { endTime: currentEndTime })
      }
    },
    handleEndDateChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        const currentEndDate = this.updateDateFromString(currentValue)
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, { endTime: currentEndDate })
      }
    },
    updateDateFromString(currentValue: string) {
      const date = new Date(currentValue)
      const currentStartDate = new Date(this.selectedQuiz.startTime)
      currentStartDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
      return currentStartDate
    },
    updateTimeFromString(currentValue: string) {
      const currentStartDate = new Date(this.selectedQuiz.startTime)
      const split = currentValue.split(':')
      const hour = parseInt(split[0])
      const minutes = parseInt(split[1])
      currentStartDate.setHours(hour)
      currentStartDate.setMinutes(minutes)
      return currentStartDate
    },
    async createAndGoToExam() {
      this.loading = true
      const res = await createEmptyExamMutation(this.$apollo)
      const id = res.id
      await this.editAndUpdateSelectedQuiz(id, { name: id })
      this.updateQuizID(id)
      this.loading = false
    },
    async editAndUpdateSelectedQuiz(id: string, input: editQuizInput) {
      const debouncedEdit = debounce(editQuizMutation)
      const res = await debouncedEdit(this.$apollo, id, input)
      console.log(res)
      this.selectedQuiz = { ...this.selectedQuiz, modified: res.modified }
      if (input.name !== undefined) {
        await this.$apollo.queries.userQuizzes.refetch()
      }
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
        return
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
