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

  <v-container fluid>
    <h2 class="text-h5 text-decoration-underline font-weight-bold mb-5">ADD USERS</h2>
    <div class="d-flex">
      <v-file-input
        ref="csvAddUpload"
        @change="handleAddCsvUpload"
        @click:clear="handleAddCsvUpload"
        accept=".csv"
        label="UPLOAD CSV TO ADD USERS"
        prepend-icon="mdi-paperclip"
        clearable
      ></v-file-input>
      <v-btn @click="showAddUsersConfirmation()" color="secondary" size="x-large" class="text-body-2"
        >ADD USERS</v-btn
      >
    </div>
  </v-container>

  <v-container fluid>
    <h2 class="text-h5 text-decoration-underline font-weight-bold mb-5">DELETE USERS</h2>
    <div class="d-flex">
      <v-file-input
        ref="csvDeleteUpload"
        @change="handleDeleteCsvUpload"
        accept=".csv"
        label="UPLOAD CSV TO DELETE USERS"
        prepend-icon="mdi-paperclip"
      ></v-file-input>
      <v-btn @click="showDeleteUsersConfirmation('csv')" color="secondary" size="x-large" class="text-body-2"
        >DELETE USERS</v-btn
      >
    </div>
    <div class="d-flex">
      <v-text-field
        label="Enter Emails (separate with ',')"
        ref="emailsToDelete"
        @input="handleEmailInputChange"
        @change="handleEmailInputChange"
        clearable
      >
        <template v-slot:details>
          <p>{{ deleteMessage }}</p>
        </template>
      </v-text-field>
      <v-btn @click="showDeleteUsersConfirmation('input')" color="secondary" size="x-large" class="text-body-2"
        >DELETE USERS</v-btn
      >
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
</template>

<script lang="ts">
import { deleteUsersMutation, addUserMutation, successMessage, downloadUsersCsvQuery } from '@/utils/userManagement'
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
  addCsv: any
  deleteCsv: any
  currentEmails: string[]
  deleteMessage: string
  loading: boolean
  popUpDialog: boolean
  popUpMessage: string
  progress: number
  successAction: string
  successfulUsers: number
  students: Student[]
  totalUsers: number,
  confirmationDialog: boolean,
  confirmationMessage: string,
  confirmAction: Function,
  cancelAction: Function,
}

export default {
  name: 'UserManagement',

  metaInfo: {},

  components: {},

  data(): IData {
    return {
      addCsv: File,
      deleteCsv: File,
      currentEmails: [],
      deleteMessage: '',
      loading: false,
      popUpDialog: false,
      popUpMessage: '',
      progress: 0,
      successAction: '',
      successfulUsers: 0,
      students: [] as Student[],
      totalUsers: 0,
      confirmationDialog: false,
      confirmationMessage: '',
      confirmAction: () => {},
      cancelAction: () => {},
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

    showAddUsersConfirmation() {
      if (this.addCsv == undefined || this.addCsv.size == undefined) {
        this.popUpMessage = 'No CSV file selected'
        this.popUpDialog = true
        return
      }
      this.showConfirmation('Are you sure you want to add users using the selected CSV?')
        .then((confirmed) => {
          if (confirmed) {
            this.addUsersWithCsv();
          }
        });
    },
    showDeleteUsersConfirmation(source: 'csv' | 'input') {
      if (source == 'csv' && (this.deleteCsv == undefined || this.deleteCsv.size == undefined)) {
        this.popUpMessage = 'No CSV file selected'
        this.popUpDialog = true
        return
      }
      else if (source == 'input' && this.currentEmails.length == 0) {
        this.popUpMessage = 'No emails entered'
        this.popUpDialog = true
        return
      }
      if (source == 'csv') {
        this.showConfirmation('Are you sure you want to delete users using the selected CSV?')
          .then((confirmed) => {
            if (confirmed) this.deleteUsersUsingCSV();
            
          });
      }
      else if (source == 'input') {
        this.showConfirmation('Are you sure you want to delete users using the entered emails?')
          .then((confirmed) => {
            if (confirmed) this.deleteUsersUsingInput();
            
          });
      }
    },
    showConfirmation(message: string): Promise<boolean> {
      return new Promise((resolve) => {
        this.confirmationMessage = message;
        this.confirmationDialog = true;

        this.confirmAction = () => {
          this.confirmationDialog = false;
          this.loading = true; // Show the loading bar
          this.popUpDialog = true;
          resolve(true);
        };

        this.cancelAction = () => {
          this.confirmationDialog = false;
          this.loading = false; // Show the loading bar
          this.popUpDialog = false;
          resolve(false);
        };
      });
    },
    handleAddCsvUpload(event: Event) {
      const input = event.target as FileInput
      const file = input.files?.[0]
      console.log(file)
      if (file) {
        console.log('CSV for adding users uploaded')
        this.addCsv = file
      } else {
        this.addCsv = undefined
      }
    },
    handleDeleteCsvUpload(event: Event) {
      const input = event.target as FileInput
      const file = input.files?.[0]

      if (file) {
        console.log('CSV for deleting users uploaded')
        this.deleteCsv = file
      } else {
        this.deleteCsv = undefined
      }
    },
    async addUsersWithCsv() {
      if (this.addCsv.size > 0) {
        try {
          this.loading = true // Show the loading bar
          this.popUpDialog = true

          this.students = await parseCSVPapaparse(this.addCsv)
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
          this.addCsv = undefined
          this.progress = 0;
          this.$refs.csvAddUpload.reset()

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
      if (this.deleteCsv.size > 0) {
        try {
          this.loading = true // Show the loading bar
          this.popUpDialog = true // Show the success dialog
          this.students = await parseCSVPapaparse(this.deleteCsv)

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
          this.deleteCsv = undefined
          this.progress = 0;
          this.$refs.csvDeleteUpload.reset()


        }
      } else {
        this.popUpMessage = 'No CSV file selected'
        this.popUpDialog = true
      }
    },

    async downloadUsersCsv() {
      try {
        const data = downloadUsersCsvQuery(this.$apollo)
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
