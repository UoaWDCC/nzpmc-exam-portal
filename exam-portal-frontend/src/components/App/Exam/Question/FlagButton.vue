<template>
    <v-tooltip left class="app-exam-question-flag-button">
        <template #activator="{ on, attrs }">
            <v-btn
                icon
                :color="currentFlagged ? 'red' : undefined"
                v-bind="attrs"
                v-on="on"
                @click="toggle"
            >
                <v-icon>{{ currentFlagged ? 'flag' : 'flag_outline' }}</v-icon>
            </v-btn>
        </template>

        <span>{{ currentFlagged ? 'Unflag question' : 'Flag question' }}</span>
    </v-tooltip>
</template>

<script>
import { mapWritableState } from 'pinia'
import { useExamStore } from '@/components/App/Exam/examStore'
import { useMainStore } from '@/stores/main'
import { UserQuizUpdateFlagMutation } from '@/gql/mutations/userQuiz'

export default {
    name: 'AppExamQuestionFlagButton',

    props: {
        flagged: Boolean,

        questionNumber: { type: Number, required: true },
    },

    data() {
        return {
            currentFlagged: false,
        }
    },

    computed: {
        // Get state from Pinia store
        ...mapWritableState(useExamStore, ['unresolvedQuestionPromises']),
        ...mapWritableState(useMainStore, ['snackbarQueue']),
    },

    watch: {
        // Ensure the flag state is synced with the server
        flagged: {
            handler(v) {
                this.currentFlagged = v
            },

            immediate: true,
        },
    },

    methods: {
        // Toggle flag state
        toggle() {
            // Set new flag state, will be reverted if mutation fails
            this.currentFlagged = !this.currentFlagged

            const mutation = this.$apollo.mutate({
                mutation: UserQuizUpdateFlagMutation,
                variables: {
                    input: {
                        userQuizID: this.$route.params.quizID,
                        questionID: this.$route.params.questionID,
                        flag: this.currentFlagged,
                    },
                },
            })

            // Record mutation in unresolved store, so AppExamTopbarSpinner shows spinner until resolved
            this.unresolvedQuestionPromises.push(mutation)

            mutation
                .catch(() => {
                    this.snackbarQueue.push(
                        `An error occured when ${
                            this.flagged ? 'unflagging' : 'flagging'
                        } Question ${
                            this.questionNumber
                        }. Please check your connection and try again.`,
                    )
                })
                .finally(() => {
                    // Ensure flag state is synced with server
                    this.currentFlagged = this.flagged
                })
        },
    },
}
</script>
