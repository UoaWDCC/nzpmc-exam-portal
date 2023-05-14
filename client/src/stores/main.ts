import { defineStore } from 'pinia'

export const useMainStore = defineStore('mainStore', {
    state: () => ({
        routeLoading: false,

        // Firebase Auth
        user: null as any,
        userLoading: true,

        // App snackbar notifications
        snackbarQueue: [] as string[],
    }),
})
