<template>
    <v-tooltip
        v-if="loading"
        bottom
        class="app-exam-topbar-spinner ml-2 text-no-wrap"
    >
        <template #activator="{ on, attrs }">
            <v-progress-circular
                indeterminate
                color="primary"
                class="flex-shrink-0 mr-2"
                :size="24"
                v-bind="attrs"
                v-on="on"
            ></v-progress-circular>
        </template>

        <span>Saving</span>
    </v-tooltip>
</template>

<script>
import { mapWritableState } from 'pinia'
import { useExamStore } from '@/components/App/Exam/examStore'

export default {
    name: 'AppExamTopbarSpinner',

    data() {
        return {
            currentPromises: [],
        }
    },

    computed: {
        // Get state from Pinia store
        ...mapWritableState(useExamStore, ['unresolvedQuestionPromises']),

        loading() {
            return this.currentPromises.length > 0
        },
    },

    watch: {
        unresolvedQuestionPromises: {
            handler(v) {
                v.forEach((promise) => {
                    // Move promise from store to local state
                    this.currentPromises.push(promise)

                    // Wait for promise to resolve or fail
                    promise.finally(() => {
                        // Remove promise from currentPromises array
                        this.currentPromises = this.currentPromises.filter(
                            (p) => p !== promise,
                        )
                    })
                })
            },

            immediate: true,
        },
    },
}
</script>
