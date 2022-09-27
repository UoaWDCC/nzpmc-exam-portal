<template>
    <div class="app-exam-question-options">
        <h2 class="mb-3 text-h5" style="line-height: 1.5">Options</h2>

        <v-item-group v-model="selected" class="mb-n3">
            <v-item
                v-for="option in sortedOptions"
                v-slot="{ active, toggle }"
                :key="option.id"
            >
                <v-card
                    elevation="1"
                    :dark="active"
                    :color="active ? '#03a9f5' : 'white'"
                    class="align-center d-flex mb-3"
                    @click="toggle"
                    @keyup.enter="toggle"
                >
                    <div>
                        <v-icon class="ml-4 my-4" v-if="active">
                            check_circle
                        </v-icon>
                    </div>

                    <span
                        class="d-block pa-4"
                        style="width: calc(100% - 3.5rem)"
                    >
                        {{ option.option }}
                    </span>
                </v-card>
            </v-item>
        </v-item-group>
    </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import { useExamStore } from '@/components/App/Exam/examStore'
import { useMainStore } from '@/stores/main'
import { UserQuizUpdateAnswerMutation } from '@/gql/mutations/userQuiz'

export default {
    name: 'AppExamQuestionOptions',

    props: {
        // Unselected answers
        options: {
            type: Array,
            required: true,
            validator(v) {
                return v.every(
                    (option) =>
                        'id' in option &&
                        typeof option.id === 'string' &&
                        'option' in option &&
                        typeof option.option === 'string',
                )
            },
        },

        // ID of the user's current answer
        answer: {
            required: true,
            validator(v) {
                return typeof v === 'string' || v === null
            },
        },

        questionNumber: { type: Number, required: true },
    },

    data() {
        return {
            selected: null,
        }
    },

    computed: {
        // Get state from Pinia store
        ...mapWritableState(useExamStore, ['unresolvedQuestionPromises']),
        ...mapWritableState(useMainStore, ['snackbarQueue']),

        // Sorted options and answer
        sortedOptions() {
            return [...this.options].sort((a, b) => (a.id > b.id ? 1 : -1))
        },
    },

    watch: {
        // Ensure the selected state is synced with the server
        answer: {
            handler(v) {
                this.setSelected(v)
            },

            immediate: true,
        },

        // Update server with new selected value
        selected(v) {
            // Cancel if answer has not been changed
            if (this.sortedOptions[v].id === this.answer) return

            const mutation = this.$apollo.mutate({
                mutation: UserQuizUpdateAnswerMutation,
                variables: {
                    input: {
                        userQuizID: this.$route.params.quizID,
                        questionID: this.$route.params.questionID,
                        answerID: v >= 0 ? this.sortedOptions[v].id : '',
                    },
                },
            })

            // Record mutation in unresolved store, so AppExamTopbarSpinner shows spinner until resolved
            this.unresolvedQuestionPromises.push(mutation)

            mutation
                .catch(() => {
                    this.snackbarQueue.push(
                        `An error occured when saving your answer for Question ${this.questionNumber}. Please check your connection and try again.`,
                    )
                })
                .finally(() => {
                    // Ensure selected state is synced with server
                    this.setSelected(this.answer)
                })
        },
    },

    methods: {
        // Ensure the selected state is synced with the server
        setSelected(answerID) {
            this.selected = this.sortedOptions.findIndex(
                (option) => option.id === answerID,
            )
        },
    },
}
</script>
