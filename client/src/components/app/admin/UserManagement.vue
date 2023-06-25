<style scoped lang="scss">
.container .v-divider {
  margin-top: 2rem;
}
</style>

<template>
  <v-container class="container add-users">
    <h2>Adding Users</h2>
    <v-file-input
      prepend-icon=""
      ref="csvUpload"
      @change="handleCsvUpload"
      accept=".csv"
      label="Upload CSV"
    ></v-file-input>
    <v-btn @click="addUsersWithCsv()">Add users using CSV</v-btn>
    <v-divider />
  </v-container>
  <v-container class="container delete-users">
    <h2>Deleting Users</h2>
    <v-btn @click="deleteUsers()">Delete users with emails</v-btn>
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
  downloadUsersCsvQuery
} from '../../../utils/userManagement'
import { parseCSVPapaparse } from '@/utils/csv_parser'
import { parse } from 'papaparse'

export type User = {
  id: int
  displayName: string
  email: string
  photoURL: string
  firstName: string
  lastName: string
  yearLevel: string
  role: string
}

export default {
  name: 'UserManagement',

  metaInfo: {},

  components: {},

  data() {
    return {
      currentCsv: File
    }
  },

  methods: {
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
    async deleteUsers() {
      try {
        const data = deleteUsersMutation(this.$apollo)
        console.log('deleted users')
      } catch (error) {
        console.log(error)
        console.log('failed to delete users')
      }
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
