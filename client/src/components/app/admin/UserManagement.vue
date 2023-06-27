<style scoped lang="scss">
.container .v-divider {
  margin-top: 2rem;
}
.container .emails {
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 0.5rem;
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
          const students: Student[] = await parseCSVPapaparse(this.currentCsv);

          const addUserPromises = students.map(async (student) => {
            // TODO: fix "surname"
            const success = await addUserMutation(
              this.$apollo,
              student.email,
              student.firstName,
              student.surname
            );
            console.log(`added ${student.firstName}: ${success}`);
            return success;
          });

          const results = await Promise.all(addUserPromises);
          const successfulAdditions = results.filter((success) => success).length;

          alert(`Successfully added ${successfulAdditions} / ${students.length} members`);
        } catch (error) {
          console.log(error);
          console.log('Failed to add users');
        }
      } else {
        alert('No CSV uploaded');
      }
    },

    parseCSV(csvData: any) {
      const parsedData = parse(csvData, { header: true }).data
      console.log(parsedData)
      // Do something with the parsed data
    },
    // TODO: add delete users by emails
    async deleteUsersUsingInput() {
      let successfullyDeleted: string[] = [];

      try {
        const deletionPromises = this.currentEmails.map(async (email: string) => {
          const success = await deleteUsersMutation(this.$apollo, email);
          console.log(`Delete success: ${success} for ${email}`);

          if (success) {
            successfullyDeleted.push(email);
          }
        });

        await Promise.all(deletionPromises);

        this.deleteMessage = successMessage(successfullyDeleted);
        alert(`Successfully deleted ${successfullyDeleted.length} / ${this.currentEmails.length} users`);
      } catch (error) {
        console.log(error);
        console.log('Failed to delete users');
      } finally {
        this.currentEmails = [];
        successfullyDeleted = [];
      }
    },
    async deleteUsersUsingCSV() {
      if (this.currentCsv.size > 0) {
        try {
          const students: Student[] = await parseCSVPapaparse(this.currentCsv);

          const deletionPromises = students.map(async (student) => {
            const success = await deleteUsersMutation(this.$apollo, student.email);
            console.log(`Delete success: ${success} for ${student.email}`);
            return success;
          });

          const deletionResults = await Promise.all(deletionPromises);
          const successfulDeletions = deletionResults.filter((success) => success).length;

          alert(`Successfully deleted ${successfulDeletions} / ${students.length} users`);
        } catch (error) {
          console.log(error);
          console.log('Failed to delete users');
        }
      } else {
        alert('No CSV uploaded');
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
