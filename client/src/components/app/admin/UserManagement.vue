<style scoped lang="scss">
.container .v-divider {
  margin-top: 2rem;
}
.container .emails {
  display: flex;
  max-width: 900px;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>

<template>
  <v-container class="container upload-csv">
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
      ref="emailsToDelete"
      @input="handleEmailInputChange"
      @change="handleEmailInputChange"
    >
      <template v-slot:details>
        <p>{{ deleteMessage }}</p>
      </template>
    </v-text-field>
    <h3>To delete:</h3>
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
  </v-container>
</template>

<script lang="ts">
import {
  deleteUsersMutation,
  addUserMutation,
  downloadUsersCsvQuery,
  successMessage
} from '../../../utils/userManagement'
import { parseCSVPapaparse } from '@/utils/csv_parser'
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
}

export default {
  name: 'UserManagement',

  metaInfo: {},

  components: {},

  data(): IData {
    return {
      currentCsv: File,
      currentEmails: [],
      deleteMessage: ''
    }
  },

  methods: {
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
      //TODO refactor out
      //TODO debounce
      if (this.currentCsv.size > 0) {
        const students = await parseCSVPapaparse(this.currentCsv)
        students.map(async (student) => {
          //TODO fix "surname"
          const success = await addUserMutation(
            this.$apollo,
            student.email,
            student.firstName,
            student.surname
          )
          console.log(`added ${student.firstName}: ${success}`)
        })
      } else {
        alert('no csv uploaded')
      }
      //TODO add the users
      /*
      const { email, firstName, lastName, photoURL, yearLevel } = currentUser
      const success = addUserMutation(this.$apollo, email, firstName, lastName, photoURL, yearLevel)
	  */
    },
    parseCSV(csvData) {
      const parsedData = parse(csvData, { header: true }).data
      console.log(parsedData)
      // Do something with the parsed data
    },
    // TODO: add delete users by emails
    async deleteUsersUsingInput() {
      let successfullyDeleted: string[] = []
      try {
        this.currentEmails.map(async (email: string) => {
          const success = await deleteUsersMutation(this.$apollo, email)
          if (success) {
            successfullyDeleted.push(email)
            this.deleteMessage = successMessage(successfullyDeleted)
          }
          console.log(`Delete success: ${success} for ${email}`)
        })
      } catch (error) {
        console.log(error)
        console.log('failed to delete users')
      } finally {
      }
    },
    async deleteUsersUsingCSV() {
      //TODO
      throw new Error('Not Implemented')
    },

    async downloadUsersCsv() {
      try {
        const data = downloadUsersCsvQuery(this.$apollo)
        console.log('downloaded users csv')
      } catch (error) {
        console.log(error)
        console.log('failed to download users csv')
      }
    }
  }
}
</script>
