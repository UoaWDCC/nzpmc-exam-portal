<script setup lang="ts">
import iconSvg from '@/assets/icon.svg'
</script>

<template>
    <v-app-bar app color="primary" dark dense height="48px" class="app-topbar">
        <v-toolbar-title class="ma-n1 pa-1">
            <router-link :to="{ name: 'App' }" class="align-center d-flex mr-2 text-decoration-none white--text">
                <v-img :src="iconSvg" width="32px" aspect-ratio="1" contain class="flex-grow-0 mr-2" />

                <div class="text-truncate">NZPMC</div>
            </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items class="mr-1">
            <v-btn :to="{ name: 'AppExams' }">My Exams</v-btn>

            <v-btn v-if="store.userIsAdmin" :to="{ name: 'AppAdmin' }">Admin</v-btn>
			<v-btn @click="signOut(auth)">Log Out</v-btn>

        </v-toolbar-items>

    </v-app-bar>
</template>

<script lang="ts">
import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import { mapWritableState } from 'pinia'
import { useMainStore } from '@/stores/main'


export default {
    name: 'AppTopbar',

    computed: {
        // Get state from Pinia store
        ...mapWritableState(useMainStore, ['snackbarQueue']),
    },

	data(){
		return {
			store: useMainStore()
		}
	},

    methods: {
        signOut() {
            signOut(auth).catch(() => {
                // An error happened.
                this.snackbarQueue.push('An error occurred when signing out.')
            })
        },
    },
}
</script>
