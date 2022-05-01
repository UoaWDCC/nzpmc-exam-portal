<template>
    <v-card elevation="2" class="pa-4">
        <h1 class="text-h4 mb-2">
            {{ createQuestionMode ? 'Create Question' : 'Question #' }}
        </h1>

        <v-form
            @submit.prevent="
                createQuestionMode ? createQuestion() : saveQuestion()
            "
            ref="questionForm"
            v-model="formIsValid"
        >
            <v-row v-if="!createQuestionMode">
                <v-col class="col col-12 col-sm-3 col-lg-2 col-xl-1">
                    <v-skeleton-loader
                        height="50"
                        type="text"
                        v-if="loading"
                    ></v-skeleton-loader>

                    <v-text-field
                        label="ID"
                        :value="id"
                        disabled
                        v-if="!loading"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <template v-if="loading">
                        <v-skeleton-loader
                            height="50"
                            type="text"
                            class="my-0"
                        ></v-skeleton-loader>

                        <v-skeleton-loader
                            height="162"
                            type="text"
                            class="mt-0"
                        ></v-skeleton-loader>
                    </template>

                    <QuizAdminEditor
                        label="Question text"
                        :value="question"
                        @input="updateQuestion"
                        :rules="[rules.required]"
                        v-if="!loading"
                    />
                </v-col>
            </v-row>

            <v-row v-if="!createQuestionMode">
                <v-col>
                    <h2 class="text-h5 mb-4">Options</h2>

                    <v-radio-group
                        v-model="answerId"
                        :rules="[rules.required]"
                        mandatory
                        class="mt-0 pt-0"
                    >
                        <template v-if="loading">
                            <v-skeleton-loader
                                height="56"
                                type="text"
                                class="my-0"
                                v-for="index in 5"
                                :key="index"
                            ></v-skeleton-loader>

                            <v-skeleton-loader
                                height="56"
                                type="text"
                                class="my-0 ml-10 mb-n2"
                            ></v-skeleton-loader>
                        </template>

                        <template v-if="!loading">
                            <QuizAdminAnswer
                                :answer="option"
                                :correctAnswerId="answerId"
                                @deleteAnswer="deleteAnswer"
                                v-for="option in allOptions"
                                :key="option.answerId"
                            />

                            <v-btn
                                color="white"
                                elevation="2"
                                class="pa-6 ml-10"
                                @click="
                                    allOptions.push({
                                        id: Math.random(),
                                        option: null,
                                    })
                                "
                            >
                                <v-icon left> add</v-icon> Add answer
                            </v-btn>
                        </template>
                    </v-radio-group>
                </v-col>
            </v-row>

            <v-alert
                type="success"
                v-if="showSuccess"
                v-text="success"
                class="my-3"
                dismissible
                close-text="Close Alert"
            >
            </v-alert>

            <v-alert
                type="error"
                v-if="showError"
                v-text="error"
                class="my-3"
                dismissible
            ></v-alert>

            <v-row>
                <v-col class="col-12 d-flex justify-end">
                    <v-skeleton-loader
                        height="42"
                        width="95"
                        type="text"
                        style="margin-top: 0; margin-bottom: -6px"
                        v-if="loading"
                    ></v-skeleton-loader>

                    <v-btn
                        type="submit"
                        color="primary"
                        :disabled="!formIsValid"
                        v-if="!loading"
                    >
                        <v-icon left class="material-icons">
                            {{ createQuestionMode ? 'add' : 'save' }}
                        </v-icon>

                        {{ createQuestionMode ? 'Create question' : 'Save' }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-card>
</template>
<style>
input {
    color: inherit !important;
}
.v-application .v-input--is-focused.primary--text {
    color: #000000 !important;
}
.v-application .v-input--is-focused.primary--text.white--text {
    color: #ffffff !important;
}
</style>

<script>
import QuizAdminEditor from './QuizAdminEditor'
import QuizAdminAnswer from './QuizAdminAnswer'
import {
    AddQuestionMutation,
    AddQuestion,
    EditQuestionMutation,
} from '@/gql/mutations/adminQuiz'
import { AdminQuizQuestionDetailsQuery } from '@/gql/queries/adminQuiz'

export default {
    components: {
        QuizAdminEditor,
        QuizAdminAnswer,
    },

    data() {
        return {
            // Form
            questionFormLoading: false,
            formIsValid: null,
            rules: {
                required: (value) => !!value || 'Required.',
            },

            success: null,
            showSuccess: false,
            error: null,
            showError: false,

            // Mathlive
            showDialog: false,

            // Fetch data
            createQuestionMode: this.$route.name === 'QuizAdminCreateQuestion',
            loading: this.$route.name !== 'QuizAdminCreateQuestion',

            id: null,
            question: null,
            allOptions: [], // Store the answer combined with the options
            answerId: null,
        }
    },

    watch: {
        questionDetails(val) {
            // Show values
            this.id = val?.id
            this.question = val?.question
            this.answerId = val?.answer?.id
            this.allOptions = []
            if (val?.answer) this.allOptions.push(val.answer)
            if (val?.options.length > 0)
                this.allOptions = [...this.allOptions, ...val.options]

            // Show inputs
            this.loading = false
        },

        success(val) {
            this.showSuccess = !!val
        },

        error(val) {
            this.showError = !!val
        },
    },

    computed: {
        addQuestionValues() {
            return {
                quizID: this.$route.params.quizId,
                question: this.question,
                numOfAnswers: 0,
                topics: '',
                imageURI: '',
            }
        },
    },

    methods: {
        updateQuestion(val) {
            if (val !== undefined) this.question = val
        },

        insertLatex() {
            this.showDialog = false
        },

        deleteAnswer(answerId) {
            // TODO: Functionality not yet implemented
            console.log(answerId)
        },

        createQuestion() {
            // Creates a quiz
            this.success = null
            this.error = null
            this.questionFormLoading = true

            this.$apollo
                .mutate({
                    mutation: AddQuestion,
                    variables: {
                        input: this.addQuestionValues,
                    },
                })
                .then((data) => {
                    // Result
                    this.questionFormLoading = false
                    this.success = 'Question successfully created.'

                    this.$refs.questionForm.reset()

                    // Redirect to new question
                    this.$router.push({
                        name: 'QuizAdminQuestion',
                        params: {
                            quizId: this.$route.params.quizId,
                            questionId: data.data.addQuestion.id,
                        },
                    })
                })
                .catch((error) => {
                    // Error
                    this.detailsFormLoading = false
                    this.error = error.message
                })
        },

        saveQuestion() {},
    },

    apollo: {
        questionDetails: {
            query: AdminQuizQuestionDetailsQuery,
            variables() {
                return {
                    quizId: this.$route.params.quizId,
                    questionId: this.$route.params.questionId,
                }
            },
            update: (data) => {
                return data.quiz.question
            },
            skip() {
                return this.createQuestionMode
            },
        },
    },
}
</script>
