<template>
    <v-sheet
        rounded
        :style="{ borderColor: answer ? '#03a9f5' : '#385F73' }"
        outlined
    >
        <div
            class="d-flex justify-space-between pa-2"
            style="height: 100%; align-items: center"
            :style="{ color: answer ? '#03a9f5' : '#385F73' }"
        >
            <DisplayText :text="text" v-if="text" :key="text" />

            <div v-else>...</div>

            <div class="d-flex">
                <v-btn
                    icon
                    @click="deleteAnswer()"
                    class="mr-2"
                    color="red"
                    v-if="!answer"
                >
                    <v-icon>clear</v-icon>
                </v-btn>

                <v-form
                    v-model="valid"
                    :disabled="loading"
                    @submit.prevent="answer ? editAnswer() : editOption()"
                >
                    <v-dialog
                        align="center"
                        v-model="dialog"
                        max-width="500"
                        persistent
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon v-bind="attrs" v-on="on">
                                <v-icon>edit</v-icon>
                            </v-btn>
                        </template>

                        <v-card>
                            <v-toolbar color="primary" dark>
                                <h3>Option Editor</h3>
                            </v-toolbar>

                            <div class="pa-4 pb-2">
                                <QuizAdminEditor
                                    label="Option text"
                                    :value="option"
                                    @input="updateOption"
                                    :rules="[(value) => !!value || 'Required.']"
                                    rows="1"
                                />

                                <h2 class="text-h5 mb-2 mt-6">Preview</h2>

                                <DisplayText
                                    :text="option"
                                    :key="option"
                                    v-if="option"
                                />
                            </div>

                            <v-alert
                                type="error"
                                v-if="showError"
                                class="ma-3"
                                @click="showError = false"
                                style="cursor: pointer"
                            >
                                {{ error }}
                            </v-alert>

                            <v-card-actions class="justify-end">
                                <v-btn large text @click="dialog = false">
                                    Cancel
                                </v-btn>

                                <v-btn
                                    type="submit"
                                    color="primary"
                                    large
                                    @click="
                                        answer ? editAnswer() : editOption()
                                    "
                                    :disabled="loading || !valid"
                                    :loading="loading"
                                >
                                    <v-icon left class="material-icons">
                                        save
                                    </v-icon>
                                    Submit
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-form>
            </div>
        </div>
    </v-sheet>
</template>

<script>
import QuizAdminEditor from './QuizAdminEditor'
import DisplayText from '@/components/DisplayText'
import {
    EditOptionMutation,
    EditAnswerMutation,
    DeleteOptionMutation,
} from '@/gql/mutations/adminQuiz'

export default {
    components: {
        QuizAdminEditor,
        DisplayText,
    },

    props: {
        text: String,
        id: String,
        answer: Boolean,
    },

    data() {
        return {
            dialog: false,

            option: '',

            // Form
            valid: false,
            loading: false,
            error: null,
            showError: false,
        }
    },

    mounted() {
        this.option = this.text
    },

    watch: {
        text(val) {
            this.option = val
        },

        error(val) {
            this.showError = !!val
        },
    },

    methods: {
        updateOption(val) {
            if (val !== undefined) this.option = val
        },

        editOption() {
            // Edits a given option
            this.error = null
            this.loading = true

            this.$apollo
                .mutate({
                    mutation: EditOptionMutation,
                    variables: {
                        input: {
                            quizID: this.$route.params.quizId,
                            questionID: this.$route.params.questionId,
                            id: this.id,
                            option: this.option,
                        },
                    },
                })
                .then(() => {
                    // Result
                    this.loading = false

                    this.$emit('updateOption', this.id, this.option)
                    this.dialog = false
                })
                .catch((error) => {
                    // Error
                    this.loading = false
                    this.error = error.message
                })
        },

        editAnswer() {
            // Edits a given answer
            this.error = null
            this.loading = true

            this.$apollo
                .mutate({
                    mutation: EditAnswerMutation,
                    variables: {
                        input: {
                            quizID: this.$route.params.quizId,
                            questionID: this.$route.params.questionId,
                            option: this.option,
                        },
                    },
                })
                .then(() => {
                    // Result
                    this.loading = false

                    this.$emit('updateOption', this.id, this.option)
                    this.dialog = false
                })
                .catch((error) => {
                    // Error
                    this.loading = false
                    this.error = error.message
                })
        },

        deleteAnswer() {
            //Deletes the given answer
            //Place holder for now
            this.error = null
            this.loading = true

            this.$apollo
                .mutate({
                    mutation: DeleteOptionMutation,
                    variables: {
                        quizId: this.$route.params.quizId,
                        questionId: this.$route.params.questionId,
                        optionId: this.id,
                    },
                })
                .then(() => {
                    // Result
                    this.loading = false
                })
                .catch((error) => {
                    // Error
                    this.loading = false
                    this.error = error.message
                })
        },
    },
}
</script>
