
<template>
<v-file-input 
 prepend-icon=""
 ref="csvUpload"
 @change="handleCsvUpload"
accept=".csv"
label="Upload CSV"></v-file-input>
<v-btn @click="addUsersWithCsv()">Add users using CSV</v-btn>
<v-btn @click="deleteUsers()">Delete users with emails</v-btn>
<v-btn @click="downloadUsersCsv()">Download CSV of users</v-btn>
</template>

<script lang="ts">
import {deleteUsers, addUsersWithCsv, downloadUsersCsv} from '../../../utils/userManagement';

export default {
    name: 'UserManagement',

    metaInfo: {
    },

    components: {  },


    data() {
        return {
			currentCsv: File,
        }
    },

    methods: {
		handleCsvUpload(event: Event){
			const input = event.target as FileInput;
			const file = input.files?.[0];

			if(file){
				console.log("uploaded")
				this.currentCsv = file;
			} else {
				this.currentCsv = undefined;
			}
		},
		addUsersWithCsv,
		deleteUsers,
		downloadUsersCsv
    },
}
</script>
