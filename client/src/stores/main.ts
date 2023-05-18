import { defineStore } from 'pinia'

export const useMainStore = defineStore('mainStore', {
  state: () => ({
    routeLoading: false,

    // Firebase Auth
    user: null as any,
    userLoading: true,
    //App claims state
    userIsAdmin: false,

    // App snackbar notifications
    snackbarQueue: []
  })
})
