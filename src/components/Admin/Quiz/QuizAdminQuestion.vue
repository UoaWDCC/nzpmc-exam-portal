<template>
    <div>
        <v-card elevation="2" class="pa-4 mb-6">
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
                            :value="questionDetails.id"
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

                        <v-row v-else>
                            <v-col cols="12" lg="6">
                                <QuizAdminEditor
                                    label="Question text"
                                    :value="questionDetails.question"
                                    @input="updateQuestion"
                                    :rules="[rules.required]"
                                />
                            </v-col>

                            <v-col>
                                <h2 class="text-h5 mb-2">Preview</h2>
                                <DisplayText
                                    :text="questionDetails.question"
                                    v-if="questionDetails.question"
                                    :key="questionDetails.question"
                                />
                            </v-col>
                        </v-row>
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

                            {{
                                createQuestionMode ? 'Create question' : 'Save'
                            }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>

        <v-card elevation="2" class="pa-4" v-if="!createQuestionMode">
            <v-row>
                <v-col>
                    <h2 class="text-h5 mb-4">Answer</h2>

                    <template v-if="loading">
                        <v-skeleton-loader
                            height="56"
                            type="text"
                            class="my-0"
                        ></v-skeleton-loader>
                    </template>

                    <QuizAdminOption
                        :text="questionDetails.answer.option"
                        selected
                        v-else
                    />

                    <h2 class="text-h5 my-4">Other options</h2>

                    <div class="d-flex flex-column" style="gap: 16px">
                        <template v-if="loading">
                            <v-skeleton-loader
                                height="56"
                                type="text"
                                class="my-0"
                                v-for="index in 4"
                                :key="index"
                            ></v-skeleton-loader>
                        </template>

                        <QuizAdminOption
                            :text="option.option"
                            v-for="option in questionDetails.options"
                            :key="option.id"
                            v-else
                        />

                        <v-btn
                            outlined
                            class="pa-6"
                            style="line-height: 1.5"
                            @click="
                                allOptions.push({
                                    id: Math.random(),
                                    option: null,
                                })
                            "
                            v-if="!loading"
                        >
                            <v-icon left> add</v-icon> Add option
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card>
    </div>
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
import DisplayText from '@/components/DisplayText'
import QuizAdminOption from './QuizAdminOption'
import { AddQuestion } from '@/gql/mutations/adminQuiz'
import { AdminQuizQuestionDetailsQuery } from '@/gql/queries/adminQuiz'

export default {
    components: {
        QuizAdminEditor,
        DisplayText,
        QuizAdminOption,
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
        }
    },

    watch: {
        questionDetails() {
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
                question: this.questionDetails.question,
                numOfAnswers: 0,
                topics: '',
                imageURI: '',
            }
        },
    },

    methods: {
        updateQuestion(val) {
            if (val !== undefined) this.questionDetails.question = val
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
