import { defineStore } from 'pinia'

export const useMainStore = defineStore('mainStore', {
    state: () => ({
        // App snackbar notifications
        snackbarQueue: [],
    }),
})
