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
                :disabled="questionFormLoading"
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

                            <v-col cols="12" lg="6">
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
                    class="my-3"
                    @click="showSuccess = false"
                    style="cursor: pointer"
                >
                    {{ success }}
                </v-alert>

                <v-alert
                    type="error"
                    v-if="showError"
                    class="my-3"
                    @click="showError = false"
                    style="cursor: pointer"
                >
                    {{ error }}
                </v-alert>

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
                            color="red"
                            class="mr-3"
                            :loading="questionFormLoading"
                            :disabled="
                                !formIsValid ||
                                createQuestionMode ||
                                questionFormLoading
                            "
                            v-if="!loading"
                            @click="deleteQuestion()"
                        >
                            <v-icon left class="material-icons">
                                {{ 'delete' }}
                            </v-icon>

                            {{ 'Delete' }}
                        </v-btn>

                        <v-btn
                            type="submit"
                            color="primary"
                            :disabled="
                                !formIsValid ||
                                originalQuestion === questionDetails.question ||
                                questionFormLoading
                            "
                            :loading="questionFormLoading"
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

        <v-card elevation="2" class="pa-4 mb-6" v-if="!createQuestionMode">
            <v-row>
                <v-col>
                    <QuizAdminQuestionFiles />
                </v-col>
            </v-row>
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
                        :text="
                            questionDetails.answer
                                ? questionDetails.answer.option
                                : ''
                        "
                        :id="
                            questionDetails.answer
                                ? questionDetails.answer.id
                                : ''
                        "
                        @updateOption="
                            (optionId, newOption) =>
                                (questionDetails.answer = {
                                    id: optionId,
                                    option: newOption,
                                })
                        "
                        answer
                        v-if="!loading"
                    />

                    <h2 class="text-h5 my-4">Other options</h2>

                    <div class="d-flex flex-column" style="gap: 16px">
                        <template v-if="loading">
                            <v-skeleton-loader
                                height="56"
                                type="text"
                                class="mt-0"
                                v-for="index in 4"
                                :key="index"
                            ></v-skeleton-loader>
                        </template>

                        <QuizAdminOption
                            :text="option.option"
                            :id="option.id"
                            v-for="(option, i) in filterOptions(
                                questionDetails.options,
                            )"
                            :key="option.id"
                            @updateOption="
                                (optionId, newOption) =>
                                    (questionDetails.options[i].option =
                                        newOption)
                            "
                            v-else
                        />

                        <v-alert
                            type="error"
                            v-if="showOptionError"
                            class="mb-0"
                            @click="showOptionError = false"
                            style="cursor: pointer"
                        >
                            {{ optionError }}
                        </v-alert>

                        <v-btn
                            outlined
                            class="pa-6"
                            style="line-height: 1.5"
                            @click="addOption"
                            :loading="addOptionLoading"
                            :disabled="addOptionLoading"
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
import QuizAdminQuestionFiles from './QuizAdminQuestionFiles'
import {
    AddQuestionMutation,
    EditQuestionMutation,
    AddOptionMutation,
    DeleteQuestionMutation,
} from '@/gql/mutations/adminQuiz'
import {
    AdminQuizQuestionsQuery,
    AdminQuizQuestionDetailsQuery,
} from '@/gql/queries/adminQuiz'
import { GetTimesQuery } from '@/gql/queries/time'

export default {
    components: {
        QuizAdminEditor,
        DisplayText,
        QuizAdminOption,
        QuizAdminQuestionFiles,
    },

    data() {
        return {
            // Form
            questionFormLoading: false,
            formIsValid: null,
            rules: {
                required: (value) => !!value || 'Required.',
            },

            originalQuestion: '', // Store the unedited question
            success: null,
            showSuccess: false,
            error: null,
            showError: false,

            questionDetails: { question: '' },

            // Mathlive
            showDialog: false,

            // Fetch data
            createQuestionMode: this.$route.name === 'QuizAdminCreateQuestion',
            loading: this.$route.name !== 'QuizAdminCreateQuestion',

            // Options
            addOptionLoading: false,
            optionError: null,
            showOptionError: false,

            //Time
            times: [],

            //using the most recent question
            questionRoute: null,
        }
    },

    watch: {
        questionDetails(val) {
            // Show inputs
            this.loading = false

            this.originalQuestion = val.question
        },

        success(val) {
            this.showSuccess = !!val
        },

        error(val) {
            this.showError = !!val
        },

        optionError(val) {
            this.showOptionError = !!val
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

        editQuestionValues() {
            return {
                quizID: this.$route.params.quizId,
                id: this.$route.params.questionId,
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

        addOption() {
            // Creates a blank option
            this.error = null
            this.addOptionLoading = true

            this.$apollo
                .mutate({
                    mutation: AddOptionMutation,
                    variables: {
                        input: {
                            quizID: this.$route.params.quizId,
                            questionID: this.$route.params.questionId,
                            option: '',
                        },
                    },
                })
                .then((data) => {
                    // Result
                    this.addOptionLoading = false

                    this.questionDetails.options.push(data.data.addOption)
                })
                .catch((error) => {
                    // Error
                    this.addOptionLoading = false
                    this.optionError = error.message
                })
        },

        createQuestion() {
            // Creates a quiz
            this.success = null
            this.error = null
            this.questionFormLoading = true

            this.$apollo
                .mutate({
                    mutation: AddQuestionMutation,
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
                    this.questionFormLoading = false
                    this.error = error.message
                })
        },

        saveQuestion() {
            // Saves changes to Quiz
            this.success = null
            this.error = null
            this.questionFormLoading = true
            this.originalQuestion = this.questionDetails.question

            this.$apollo
                .mutate({
                    mutation: EditQuestionMutation,
                    variables: {
                        input: this.editQuestionValues,
                    },
                })
                .then(() => {
                    // Result
                    this.questionFormLoading = false
                })
                .catch((error) => {
                    // Error
                    this.questionFormLoading = false
                    this.error = error.message
                })
        },

        filterOptions(optionArr) {
            //Takes in the options array from questionDetail and filters out the answer to render options only without changing the actual options array
            const tempArr = optionArr
            for (let i = 0; i < optionArr.length; i++) {
                if (
                    optionArr[i].option === this.questionDetails.answer.option
                ) {
                    tempArr.splice(i, 1)
                    break
                }
            }
            return tempArr
        },

        async getTime() {
            //Checks if the current time is in the duration of the quiz
            await this.$apollo
                .query({
                    query: GetTimesQuery,
                    variables: {
                        quizId: this.$route.params.quizId,
                    },
                })
                .then((resp) => {
                    this.times[0] = Date.parse(resp.data.quiz.startTime)
                    this.times[1] = Date.parse(resp.data.quiz.endTime)
                    this.times[2] = Date.now()
                    if (
                        !(
                            this.times[0] < this.times[2] &&
                            this.times[1] > this.times[2]
                        )
                    ) {
                        // If the quiz is not active, then can make changes to the question
                        return true
                    } else {
                        // If the quiz is active, then cannot make changes to the question
                        return false
                    }
                })
                .catch((error) => {
                    //Errors will be caught and no changes will occur
                    console.log(error)
                    return false
                })
        },

        async deleteQuestion() {
            //Deletes the question from the quiz and redirects to the first question in the quiz
            this.success = null
            this.error = null
            this.questionFormLoading = true

            //Gets the first question in the quiz
            await this.$apollo
                .query({
                    query: AdminQuizQuestionsQuery,
                    variables: { quizID: this.$route.params.quizId },
                })
                .then((resp) => {
                    this.questionRoute = resp.data.quiz.questions[0].id
                })
                .catch((error) => {
                    console.log(error)
                })

            if (this.getTime()) {
                this.$apollo
                    .mutate({
                        mutation: DeleteQuestionMutation,
                        variables: {
                            quizId: this.$route.params.quizId,
                            questionId: this.$route.params.questionId,
                        },
                    })
                    .then(() => {
                        this.questionFormLoading = false
                        //Routes to the first question in quiz
                        this.$router.push({
                            name: 'QuizAdminQuestion',
                            params: {
                                quizId: this.$route.params.quizId,
                                questionId: this.questionRoute,
                            },
                        })
                    })
                    .catch((error) => {
                        this.questionFormLoading = false
                        this.error = error.message
                    })
            } else {
                this.questionFormLoading = false
            }
        },
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
