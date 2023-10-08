<template>
  <v-dialog v-model="confirmationDialog" max-width="400">
    <v-card>
      <v-card-title class="popup-headline">Confirm Action</v-card-title>
      <v-card-text class="popup-text">{{ confirmationMessage }}</v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="confirmAction">Yes</v-btn>
        <v-btn color="secondary" @click="cancelAction">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
        :disabled="loading"
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
            label="Open Date"
            type="date"
            prepend-inner-icon="mdi-calendar-range"
            @change="handleOpenDateChange"
            :model-value="quizStartDate"
          ></v-text-field>
          <v-text-field
            label="Open Time"
            :disabled="loading"
            type="time"
            prepend-inner-icon="mdi-clock-time-eight-outline"
            @change="handleOpenTimeChange"
            :model-value="quizStartTime"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Close Date"
            :disabled="loading"
            type="date"
            :model-value="quizEndDate"
            @change="handleCloseDateChange"
            prepend-inner-icon="mdi-calendar-range"
          ></v-text-field>
          <v-text-field
            label="Close Time"
            :disabled="loading"
            type="time"
            prepend-inner-icon="mdi-clock-time-eight-outline"
            @change="handleCloseTimeChange"
            :model-value="quizEndTime"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-container fluid class="px-0">
        <v-btn size="large" :disabled="loading" color="blue-darken-2" @click="showEditQuestionPopUp"
          >EDIT QUESTIONS<v-icon end icon="mdi-cog"></v-icon
        ></v-btn>
      </v-container>

      <v-container fluid class="px-0 mt-5">
        <v-btn @click="enrollUserIntoQuiz" block size="large" color="white" :disabled="loading"
          >ENROLL STUDENTS TO EXAM (UPLOAD CSV)<v-icon end icon="mdi-paperclip"></v-icon
        ></v-btn>
        <v-file-input
          ref="csvUploadZone"
          class="d-none"
          type="file"
          accept=".csv"
          @change="handleCsvUpload"
        />
        <v-btn
          @click="downloadUserQuizzes"
          block
          size="large"
          color="blue-darken-2"
          class="mt-3"
          :disabled="loading"
          >DOWNLOAD USERS CSV OF CURRENT EXAM</v-btn
        >
        <v-btn
          @click="deleteCurrentExam"
          block
          size="large"
          color="red"
          class="mt-3"
          :disabled="loading"
        >
          DELETE CURRENT EXAM
        </v-btn>
      </v-container>

      <v-container fluid class="px-0 mt-5">
        <v-btn
          block
          size="large"
          :disabled="loading"
          @click="
            quizIdInput !== '' &&
              $router.push({ name: 'AppGrading', query: { quizID: quizIdInput } })
          "
          color="secondary"
          >Manage Grades</v-btn
        >
      </v-container>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { User } from '@/components/app/admin/UserManagement.vue'
import { AllQuizIDQuery } from '@/gql/queries/quiz'
import { parseCSVPapaparse } from '@/utils/csv_parser'
import {
  debounce,
  downloadUserQuizzesCsvQuery,
  editQuizMutation,
  getQuizInfoQuery,
  createEmptyExamMutation,
  formatDateToDate,
  type editQuizInput,
  formatDateToTime,
  enrolUsersInQuizFromCSV,
  deleteExam
} from '@/utils/quizManagement'
import type { QuizModel } from '@nzpmc-exam-portal/common'
import { onMounted } from 'vue'

export type UserQuiz = {
  user: User
  score: number
}

export interface IData {
  quizzes: QuizModel[]
  quizIdInput: string
  loading: boolean
  popUpDialog: boolean
  popUpMessage: string
  selectedQuiz: QuizModel | undefined
  uploadedCsv: any
  confirmationDialog: boolean
  confirmationMessage: string
  confirmAction: Function
  cancelAction: Function
  error: string
}

export default defineComponent({
  name: 'QuizManagement',

  data(): IData {
    return {
      quizzes: [],
      quizIdInput: '',
      loading: false,
      error: '',
      popUpDialog: false,
      popUpMessage: '',
      selectedQuiz: undefined,
      uploadedCsv: null,
      confirmationDialog: false,
      confirmationMessage: '',
      confirmAction: () => {},
      cancelAction: () => {}
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
            onMounted(async () => {})
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
        const date = new Date(this.selectedQuiz.openTime)
        return formatDateToDate(date)
      }
      return ``
    },
    quizEndDate() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.closeTime)
        return formatDateToDate(date)
      }
      return ``
    },
    quizStartTime() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.openTime)
        return formatDateToTime(date)
      }
      return ``
    },
    quizEndTime() {
      if (this.selectedQuiz !== undefined) {
        const date = new Date(this.selectedQuiz.closeTime)
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
      this.$refs.csvUploadZone.reset()
      this.quizIdInput = id
      this.$router.push({ query: { quizID: id } })
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
    handleOpenDateChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        const currentOpenDate = this.updateDateFromString(currentValue, this.selectedQuiz.openTime)
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, { openTime: currentOpenDate })
      }
    },
    handleOpenTimeChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        const currentOpenTime = this.updateTimeFromString(currentValue, this.selectedQuiz.openTime)
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, { openTime: currentOpenTime })
      }
    },
    handleCloseTimeChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        const currentCloseTime = this.updateTimeFromString(
          currentValue,
          this.selectedQuiz.closeTime
        )
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, { closeTime: currentCloseTime })
      }
    },
    handleCloseDateChange(event: Event) {
      const currentValue: string = event.target.value
      if (this.selectedQuiz !== undefined) {
        const currentCloseDate = this.updateDateFromString(
          currentValue,
          this.selectedQuiz.closeTime
        )
        this.editAndUpdateSelectedQuiz(this.selectedQuiz.id, { closeTime: currentCloseDate })
      }
    },
    showEditQuestionPopUp() {
      // TODO: Implement this
      if (this.selectedQuiz === undefined) {
        this.popUpMessage = 'No quiz selected'
        this.popUpDialog = true
        return
      } else {
        this.$router.push({
          name: 'AppExam',
          params: { quizID: this.selectedQuiz.id },
          query: { edit: 'true' }
        })
        this.popUpMessage = 'This feature is not yet implemented'
        this.popUpDialog = true
      }
    },
    async showEnrolUsersConfirmation() {
      console.log(this.uploadedCsv)

      if (this.uploadedCsv == undefined || this.uploadedCsv.size == undefined) {
        this.popUpMessage = 'No CSV file selected'
        this.popUpDialog = true
        return
      }

      // Trigger the confirmation dialog immediately upon file selection
      this.showConfirmation(
        "Are you sure you want to add users using the selected CSV?\n\nThis will OVERWRITE the list of enrolled users in the system with the users in the file. Users that aren't registered in the system yet will be created and existing users will be updated. Please download the currently enrolled users before proceeding if you wish to retain a record."
      ).then(async (confirmed) => {
        if (confirmed) {
          try {
            this.loading = true
            const students = await parseCSVPapaparse(this.uploadedCsv)
            const enrolledUsers = await enrolUsersInQuizFromCSV(
              this.$apollo,
              this.quizIdInput,
              this.uploadedCsv
            ).then((res) => res.enrolUsersInQuiz)
            console.log(enrolledUsers)
            console.log(`Enrolled users: ${enrolledUsers.length} / ${students.length}`)
            this.popUpMessage = `Enrolled users: ${enrolledUsers.length} / ${students.length}`
            this.popUpDialog = true
          } catch (error) {
            console.error('Failed to enroll users into the quiz:', error)
            this.popUpMessage = 'Failed to enroll students'
            this.popUpDialog = true
          } finally {
            this.loading = false
          }
        }
      })
    },

    showConfirmation(message: string): Promise<boolean> {
      return new Promise((resolve) => {
        this.confirmationMessage = message
        this.confirmationDialog = true

        this.confirmAction = () => {
          this.confirmationDialog = false
          this.loading = true // Show the loading bar
          this.popUpDialog = true
          resolve(true)
        }

        this.cancelAction = () => {
          this.confirmationDialog = false
          this.loading = false // Show the loading bar
          this.popUpDialog = false
          resolve(false)
        }
      })
    },
    async handleCsvUpload(e: any) {
      this.uploadedCsv = e.target.files[0]
      await this.showEnrolUsersConfirmation()
    },
    updateDateFromString(currentValue: string, currentTimeString: string) {
      const date = new Date(currentValue)
      const currentDate = new Date(currentTimeString)
      currentDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
      return currentDate
    },
    updateTimeFromString(currentValue: string, currentTimeString: string) {
      const currentDate = new Date(currentTimeString)
      const split = currentValue.split(':')
      const hour = parseInt(split[0])
      const minutes = parseInt(split[1])
      currentDate.setHours(hour)
      currentDate.setMinutes(minutes)
      return currentDate
    },
    async createAndGoToExam() {
      this.loading = true
      const res = await createEmptyExamMutation(this.$apollo)
      const id = res.id
      await this.editAndUpdateSelectedQuiz(id, { name: id })
      await this.updateQuizID(id)
      this.loading = false
    },
    async deleteCurrentExam() {
      this.loading = true
      await deleteExam(this.$apollo, this.quizIdInput)
      await this.updateQuizID('')
      await this.$apollo.queries.userQuizzes.refetch()
      this.loading = false
    },
    async editAndUpdateSelectedQuiz(id: string, input: editQuizInput) {
      const debouncedEdit = debounce(editQuizMutation)
      this.loading = true
      const res = await debouncedEdit(this.$apollo, id, input)
      this.selectedQuiz = { ...this.selectedQuiz, modified: res.modified }
      if (input.name !== undefined) {
        await this.$apollo.queries.userQuizzes.refetch()
      }
      this.loading = false
    },
    async enrollUserIntoQuiz() {
      try {
        if (this.selectedQuiz === undefined) {
          this.popUpMessage = 'No quiz selected'
          this.popUpDialog = true
          return
        }
        if (this.selectedQuiz !== undefined) {
          this.loading = true
          window.addEventListener(
            'focus',
            () => {
              this.loading = false
            },
            { once: true }
          )

          this.$refs.csvUploadZone.click()
        }
      } catch (error) {
        console.error('Failed to enroll user into the quiz:', error)
      } finally {
        this.uploadedCsv = null
        this.$refs.csvUploadZone.reset()
      }
    },

    async fetchQuizInfo() {
      try {
        const quiz = await getQuizInfoQuery(this.$apollo.getClient(), this.quizIdInput)
        this.selectedQuiz = quiz
        return
      } catch (error) {
        console.error('Failed to fetch quiz info:', error)
      }
    },

    async downloadUserQuizzes() {
      try {
        if (this.selectedQuiz === undefined) {
          this.popUpMessage = 'No quiz selected'
          this.popUpDialog = true
          return
        }
        const success = await downloadUserQuizzesCsvQuery(this.$apollo, this.quizIdInput) // waits for the query to finish

        this.popUpMessage = 'Downloaded user quizzes for quiz id: ' + this.quizIdInput
        if (!success) {
          this.popUpMessage = 'No user quizzes found for: ' + this.quizIdInput
        }

        this.popUpDialog = true
      } catch (error) {
        console.error('Failed to download user quizzes:', error)

        this.popUpMessage = 'Failed to download user quizzes for quiz id: ' + this.quizIdInput
        this.popUpDialog = true
      }
    },
    goToGradingScreen() {
      localStorage.setItem(`${this.quizIdInput}`, JSON.stringify(this.selectedQuiz))
      this.$router.push({ name: 'AppGrading', query: { quizID: this.quizIdInput } })
    }
  },
  mounted() {
    const presetQuizID = this.$route.query.quizID
    if (presetQuizID && typeof presetQuizID === 'string') {
      this.updateQuizID(presetQuizID)
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

.popup-dialog {
  width: 600px;
  max-width: 100%;
}
.popup-headline {
  text-align: center;
}
.popup-text {
  font-size: 1.5rem;
  text-align: center;
  white-space: pre-line;
}
.popup-button {
  margin: 0 auto;
  display: block;
}
</style>
