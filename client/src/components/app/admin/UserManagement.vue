<style scoped lang="scss">
.container .v-divider {
  margin-top: 2rem;
}
.emails {
  display: flex;
  flex-direction: row;
  max-width: 100%;
  gap: 0.5rem;
  padding: 0;
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
}
.popup-button {
  margin: 0 auto;
  display: block;
}
</style>

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

  <v-container fluid>
    <h2 class="text-h5 text-decoration-underline font-weight-bold mb-5">ADD USERS</h2>
    <div class="d-flex">
      <v-file-input label="UPLOAD CSV TO ADD USERS" prepend-icon="mdi-paperclip"></v-file-input>
      <v-btn @click="addUsersWithCsv()" color="secondary" size="x-large" class="text-body-2">ADD USERS</v-btn>
    </div>
  </v-container>

  <v-container fluid>
    <h2 class="text-h5 text-decoration-underline font-weight-bold mb-5">DELETE USERS</h2>
    <div class="d-flex">
      <v-file-input label="UPLOAD CSV TO DELETE USERS" prepend-icon="mdi-paperclip"></v-file-input>
      <v-btn @click="deleteUsersUsingCSV()" color="secondary" size="x-large" class="text-body-2">DELETE USERS</v-btn>
    </div>
    <div class="d-flex">
      <v-text-field
        label="Enter Emails (separate with ',')"
        ref="emailsToDelete"
        @input="handleEmailInputChange"
        @change="handleEmailInputChange"
      >
        <template v-slot:details>
          <p>{{ deleteMessage }}</p>
        </template>
      </v-text-field>
      <v-btn @click="deleteUsersUsingInput()" color="secondary" size="x-large" class="text-body-2">DELETE USERS</v-btn>
    </div>
    <span style="display: flex; align-items: center; justify-content: space-between">
      <h3>To delete:</h3>
      <v-btn color="red" variant="outlined" @click="removeAllEmailsFromList()">Clear</v-btn>
    </span>
    <v-container class="emails">
      <div v-for="(email, index) in currentEmails" :key="index">
        <v-chip label closable @click:close="removeEmailFromList(index)">{{ email }}</v-chip>
      </div>
    </v-container>
  </v-container>

  <v-container>
    <v-btn @click="downloadUsersCsv()" block size="large" color="blue-darken-2" class="mt-3"
      >DOWNLOAD USERS CSV FOR ALL EXAMS</v-btn
    >
  </v-container>

  <!-- <v-container class="container upload-csv bg-red">
    <h2>Upload CSV</h2>
    <v-file-input
      prepend-icon=""
      ref="csvUpload"
      @change="handleCsvUpload"
      accept=".csv"
      label="Upload CSV"
    ></v-file-input>
    <v-divider />
  </v-container>
  <v-container class="container add-users">
    <h2>Adding Users</h2>
    <v-btn @click="addUsersWithCsv()">Add users using CSV</v-btn>
    <v-divider />
  </v-container>
  <v-container class="container delete-users">
    <h2>Deleting Users</h2>
    <v-text-field
      label="Enter Emails (separate with ',')"

      @input="handleEmailInputChange"
      @change="handleEmailInputChange"
    >
      <template v-slot:details>
        <p>{{ deleteMessage }}</p>
      </template>
    </v-text-field>
    <span style="display: flex; align-items: center; justify-content: space-between">
      <h3>To delete:</h3>
      <v-btn color="red" variant="outlined" @click="removeAllEmailsFromList()">Clear</v-btn>
    </span>
    <v-container class="emails">
      <div v-for="(email, index) in currentEmails" :key="index">
        <v-chip label closable @click:close="removeEmailFromList(index)">{{ email }}</v-chip>
      </div>
    </v-container>
    <v-btn @click="deleteUsersUsingInput()">Delete users with emails</v-btn>
    <v-btn @click="deleteUsersUsingCSV()">Delete users with CSV</v-btn>
    <v-divider />
  </v-container>
  <v-container class="container download-users-csv">
    <h2>Get User data</h2>
    <v-btn @click="downloadUsersCsv()">Download CSV of users</v-btn>
    <v-divider />
  </v-container> -->
</template>

<script lang="ts">
import { deleteUsersMutation, addUserMutation, successMessage } from '@/utils/userManagement'
import { parseCSVPapaparse } from '@/utils/csv_parser'
import type { Student } from '@/utils/csv_parser'
import { parse } from 'papaparse'

export type User = {
  id: string
  displayName: string
  email: string
  photoURL: string
  firstName: string
  lastName: string
  yearLevel: string
  role: string
}
export interface IData {
  currentCsv: any
  currentEmails: string[]
  deleteMessage: string
  loading: boolean
  popUpDialog: boolean
  popUpMessage: string
  progress: number
  successAction: string
  successfulUsers: number
  students: Student[]
  totalUsers: number
}

export default {
  name: 'UserManagement',

  metaInfo: {},

  components: {},

  data(): IData {
    return {
      currentCsv: File,
      currentEmails: [],
      deleteMessage: '',
      loading: false,
      popUpDialog: false,
      popUpMessage: '',
      progress: 0,
      successAction: '',
      successfulUsers: 0,
      students: [] as Student[],
      totalUsers: 0
    }
  },

  methods: {
    removeAllEmailsFromList() {
      this.currentEmails = []
    },
    removeEmailFromList(index: number) {
      this.currentEmails.splice(index, 1)
    },
    handleEmailInputChange(event: Event) {
      //TODO: Implement debounce
      const currentValue: string = event.target.value
      if (currentValue.includes(',') || event.type === 'change') {
        const addedEmails = currentValue.split(',')
        addedEmails.map((email: string) => {
          //TODO: verify email properly
          if (email.length !== 0 && !this.currentEmails.includes(email)) {
            this.currentEmails.push(email.trim())
          }
        })
        this.$refs.emailsToDelete.reset()
        console.log(this.currentEmails)
      }
    },
    handleCsvUpload(event: Event) {
      const input = event.target as FileInput
      const file = input.files?.[0]

      if (file) {
        console.log('uploaded')
        this.currentCsv = file
      } else {
        this.currentCsv = undefined
      }
    },
    async addUsersWithCsv() {
      if (this.currentCsv.size > 0) {
        try {
          this.loading = true // Show the loading bar
          this.popUpDialog = true

          this.students = await parseCSVPapaparse(this.currentCsv)
          let addedUsers = 0
          const addUserPromises = this.students.map(async (student) => {
            // TODO: fix "surname"

            const success = await addUserMutation(
              this.$apollo,
              student.email,
              student.firstName,
              student.surname,
              null,
              student.yearLevel,
              'student'
            )
            console.log(`added ${student.firstName}: ${success}`)
            if (success) {
              addedUsers++
              this.progress = (addedUsers / this.students.length) * 100
            }
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Delay of 1 second

            return success
          })

          const results = await Promise.all(addUserPromises)
          this.successfulUsers = results.filter((success) => success).length
          this.totalUsers = this.students.length
          this.successAction = 'added'
          if (this.successfulUsers === 0) {
            this.popUpMessage = 'No users added'
          } else {
            this.popUpMessage = `Successfully ${this.successAction} ${this.successfulUsers} / ${this.totalUsers} users`
          }
          console.log(this.progress)
          await new Promise((resolve) => setTimeout(resolve, 1000))
          this.popUpDialog = true // Show the success dialog
        } catch (error) {
          console.log(error)
          console.log('Failed to add users')
        } finally {
          this.loading = false // Hide the loading bar
          this.progress = 0
        }
      } else {
        this.popUpMessage = 'No CSV file selected'
        this.popUpDialog = true
      }
    },

    parseCSV(csvData: any) {
      const parsedData = parse(csvData, { header: true }).data
      console.log(parsedData)
      // Do something with the parsed data
    },
    // TODO: add delete users by emails
    async deleteUsersUsingInput() {
      let successfullyDeleted: string[] = []

      try {
        this.loading = true // Show the loading bar
        this.popUpDialog = true
        const deletionPromises = this.currentEmails.map(async (email: string) => {
          const success = await deleteUsersMutation(this.$apollo, email)
          console.log(`Delete success: ${success} for ${email}`)

          if (success) {
            successfullyDeleted.push(email)
          }
        })

        await Promise.all(deletionPromises)

        this.deleteMessage = successMessage(successfullyDeleted)
        this.successfulUsers = successfullyDeleted.length
        this.totalUsers = this.currentEmails.length
        this.successAction = 'deleted'
        if (this.successfulUsers === 0) {
          this.popUpMessage = `No users were ${this.successAction}`
        } else if (this.successfulUsers === this.totalUsers) {
          this.popUpMessage = `Successfully ${this.successAction} all ${this.successfulUsers} users`
        } else if (this.successfulUsers < this.totalUsers) {
          this.popUpMessage = `Successfully ${this.successAction} ${this.successfulUsers} / ${this.totalUsers} users`
        }
      } catch (error) {
        console.log(error)
        console.log('Failed to delete users')
      } finally {
        this.currentEmails = []
        successfullyDeleted = []
        this.loading = false // Hide the loading bar
      }
    },
    async deleteUsersUsingCSV() {
      if (this.currentCsv.size > 0) {
        try {
          this.loading = true // Show the loading bar
          this.popUpDialog = true // Show the success dialog
          this.students = await parseCSVPapaparse(this.currentCsv)

          const deletionPromises = this.students.map(async (student) => {
            const success = await deleteUsersMutation(this.$apollo, student.email)
            console.log(`Delete success: ${success} for ${student.email}`)
            return success
          })

          const deletionResults = await Promise.all(deletionPromises)

          this.successAction = 'deleted'
          this.successfulUsers = deletionResults.filter((success) => success).length
          this.totalUsers = this.students.length
          if (this.successfulUsers === 0) {
            this.popUpMessage = `No users were ${this.successAction}`
          } else if (this.successfulUsers === this.totalUsers) {
            this.popUpMessage = `Successfully ${this.successAction} all ${this.successfulUsers} users`
          } else if (this.successfulUsers < this.totalUsers) {
            this.popUpMessage = `Successfully ${this.successAction} ${this.successfulUsers} / ${this.totalUsers} users`
          }
        } catch (error) {
          console.log(error)
          console.log('Failed to delete users')
        } finally {
          this.loading = false // Hide the loading bar
        }
      } else {
        this.popUpMessage = 'No CSV file selected'
        this.popUpDialog = true
      }
    },

    async downloadUsersCsv() {
      try {
        console.log('downloaded users csv')
        this.popUpMessage = 'Downloaded users csv'
        this.popUpDialog = true
      } catch (error) {
        console.log(error)
        console.log('failed to download users csv')
        this.popUpMessage = 'Failed to download users csv'
        this.popUpDialog = true
      }
    }
  }
}
</script>
