import { defineStore } from 'pinia'

export const useExamStore = defineStore('examStore', {
    state: () => ({
        // Promises still that still need to be resolved
        unresolvedQuestionPromises: [],
    }),
})
