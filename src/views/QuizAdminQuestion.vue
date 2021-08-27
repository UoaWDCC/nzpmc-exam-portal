<template>
    <v-card elevation="2" class="pa-4">
        <h1 class="text-h4 mb-2">
            {{ createQuestionMode ? 'Create Question' : 'Question #' }}
        </h1>

        <v-form ref="questionForm" v-model="formIsValid">
            <v-row>
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
                    <h2 class="text-h5 mb-4">Question Text</h2>

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

                    <Editor
                        label="Question text"
                        :value="question"
                        @input="updateQuestion"
                        :rules="[rules.required]"
                        v-if="!loading"
                    />
                </v-col>
            </v-row>

            <v-row>
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
                                class="my-0 ml-10"
                            ></v-skeleton-loader>
                        </template>

                        <template v-if="!loading">
                            <QuizAdminSingleAnswer
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
import Editor from '../components/Editor'
import QuizAdminSingleAnswer from '../components/QuizAdminSingleAnswer'
import { AdminQuizQuestionDetailsQuery } from '../gql/queries/adminQuiz'

export default {
    components: {
        Editor,
        QuizAdminSingleAnswer,
    },
    data() {
        return {
            // Form
            questionForm: null,
            formIsValid: null,
            rules: {
                required: (value) => !!value || 'Required.',
            },

            // Mathlive
            showDialog: false,

            // Fetch data
            loading: true,

            id: null,
            question: null,
            allOptions: null, // Store the answer combined with the options
            answerId: null,
        }
    },

    computed: {
        createQuestionMode() {
            return this.$route.name === 'QuizAdminCreateQuestion'
        },
    },

    watch: {
        questionDetails(val) {
            // Show values
            this.id = val.id
            this.question = val.question
            this.answerId = val.answer.id
            this.allOptions = [val.answer, ...val.options]

            // Show inputs
            this.loading = false
        },
    },

    methods: {
        updateQuestion(val) {
            this.question = val
        },

        insertLatex(value) {
            this.showDialog = false
            console.log(value)
        },

        deleteAnswer(answerId) {
            // Functionality not yet implemented
            console.log(answerId)
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
        },
    },
}
</script>
