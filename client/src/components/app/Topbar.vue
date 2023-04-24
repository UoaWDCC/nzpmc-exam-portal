<script setup>
import iconSvg from '@/assets/icon.svg'
</script>

<template>
    <v-app-bar app color="primary" dark dense height="48px" class="app-topbar">
        <v-toolbar-title class="ma-n1 pa-1">
            <router-link
                :to="{ name: 'Site' }"
                class="align-center d-flex mr-2 text-decoration-none white--text"
            >
                <v-img
                    :src="iconSvg"
                    width="32px"
                    aspect-ratio="1"
                    contain
                    class="flex-grow-0 mr-2"
                />

                <div class="text-truncate">NZPMC</div>
            </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items class="mr-1">
            <v-btn text :to="{ name: 'AppExams' }">My Exams</v-btn>

            <v-btn text :to="{ name: 'AppAdmin' }">Admin</v-btn>
        </v-toolbar-items>

        <v-menu offset-y>
            <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-account</v-icon>
                </v-btn>
            </template>

            <v-list dense>
                <v-list-item link @click="signOut(auth)">
                    <v-list-item-icon>
                        <v-icon>mdi-logout</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>Sign out</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script>
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
