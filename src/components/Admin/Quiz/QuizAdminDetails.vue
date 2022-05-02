<template>
    <v-card elevation="2" class="pa-4">
        <h1 class="text-h4 mb-2">
            {{ createQuizMode ? 'Create Quiz' : 'Quiz Details' }}
        </h1>

        <v-form
            @submit.prevent="createQuizMode ? createQuiz() : saveQuiz()"
            ref="detailsForm"
            v-model="formIsValid"
        >
            <v-row dense>
                <v-col class="col col-12 col-sm-4 col-lg-3 col-xl-2">
                    <v-skeleton-loader
                        height="50"
                        type="text"
                        v-if="loading"
                    ></v-skeleton-loader>

                    <v-text-field
                        label="ID"
                        v-model="id"
                        disabled
                        v-if="!loading"
                    ></v-text-field>
                </v-col>

                <v-col class="col">
                    <v-skeleton-loader
                        height="50"
                        type="text"
                        v-if="loading"
                    ></v-skeleton-loader>

                    <v-text-field
                        label="Name"
                        v-model="name"
                        :rules="[rules.required]"
                        v-if="!loading"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col>
                    <v-skeleton-loader
                        height="50"
                        type="text"
                        v-if="loading"
                    ></v-skeleton-loader>

                    <v-text-field
                        label="Description"
                        v-model="description"
                        v-if="!loading"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col>
                    <v-skeleton-loader
                        height="50"
                        type="text"
                        v-if="loading"
                    ></v-skeleton-loader>

                    <v-text-field
                        type="number"
                        label="Duration (seconds)"
                        v-model="duration"
                        :rules="[rules.required]"
                        v-if="!loading"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col class="col-6">
                    <v-skeleton-loader
                        height="50"
                        type="text"
                        v-if="loading"
                    ></v-skeleton-loader>

                    <v-menu
                        :close-on-content-click="false"
                        :nudge-bottom="8"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                        v-if="!loading"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="startDate"
                                label="Start date"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="[rules.required]"
                            ></v-text-field>
                        </template>

                        <v-date-picker v-model="startDate"></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col class="col-6">
                    <v-skeleton-loader
                        height="50"
                        type="text"
                        v-if="loading"
                    ></v-skeleton-loader>

                    <v-menu
                        :close-on-content-click="false"
                        :nudge-bottom="8"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                        v-if="!loading"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="startTime"
                                label="Start time"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="[rules.required]"
                            ></v-text-field>
                        </template>

                        <v-time-picker
                            v-model="startTime"
                            full-width
                            format="24hr"
                        ></v-time-picker>
                    </v-menu>
                </v-col>
            </v-row>

            <v-row dense>
                <v-col class="col-6">
                    <v-skeleton-loader
                        height="50"
                        type="text"
                        v-if="loading"
                    ></v-skeleton-loader>

                    <v-menu
                        :close-on-content-click="false"
                        :nudge-bottom="8"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                        v-if="!loading"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="endDate"
                                label="End date"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="[rules.required]"
                            ></v-text-field>
                        </template>

                        <v-date-picker v-model="endDate"></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col class="col-6">
                    <v-skeleton-loader
                        height="50"
                        type="text"
                        v-if="loading"
                    ></v-skeleton-loader>

                    <v-menu
                        :close-on-content-click="false"
                        :nudge-bottom="8"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                        v-if="!loading"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="endTime"
                                label="End time"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                :rules="[rules.required]"
                            ></v-text-field>
                        </template>

                        <v-time-picker
                            v-model="endTime"
                            full-width
                            format="24hr"
                        ></v-time-picker>
                    </v-menu>
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
                        type="submit"
                        color="primary"
                        :disabled="!formIsValid || detailsFormLoading"
                        :loading="detailsFormLoading"
                        v-if="!loading"
                    >
                        <v-icon left class="material-icons">
                            {{ createQuizMode ? 'add' : 'save' }}
                        </v-icon>

                        {{ createQuizMode ? 'Create quiz' : 'Save' }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-card>
</template>

<style>
.v-time-picker-title {
    justify-content: center !important;
}
.v-skeleton-loader {
    display: flex;
    flex-direction: column;
    margin-top: 4px;
    margin-bottom: -6px;
}
</style>

<script>
import { AdminQuizDetailsQuery } from '@/gql/queries/adminQuiz'
import { AddQuizMutation, EditQuizMutation } from '@/gql/mutations/adminQuiz'
import { AdminQuizzesQuery } from '@/gql/queries/adminQuiz'

export default {
    data() {
        return {
            // Form
            detailsForm: null,
            detailsFormLoading: false,
            formIsValid: null,
            rules: {
                required: (value) => !!value || 'Required.',
            },

            success: null,
            showSuccess: false,
            error: null,
            showError: false,

            // Fetch data
            createQuizMode: this.$route.name === 'QuizAdminCreateQuiz',
            loading: this.$route.name !== 'QuizAdminCreateQuiz',

            id: null,
            name: null,
            description: null,
            duration: null,
            startDate: null,
            startTime: null,
            endDate: null,
            endTime: null,
        }
    },

    watch: {
        quizDetails(val) {
            // Show values
            this.id = val.id
            this.name = val.name
            this.description = val.description
            this.duration = val.duration

            // Display formatted dates and times based on query data
            const startDateTime = new Date(val.startTime).toISOString()
            this.startDate = startDateTime.substr(0, 10)
            this.startTime = startDateTime.substr(11, 5)

            const endDateTime = new Date(val.endTime).toISOString()
            this.endDate = endDateTime.substr(0, 10)
            this.endTime = endDateTime.substr(11, 5)

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

    apollo: {
        quizDetails: {
            query: AdminQuizDetailsQuery,
            variables() {
                return {
                    quizID: this.$route.params.quizId,
                }
            },
            update: (data) => {
                return data.quiz
            },
            skip() {
                return this.createQuizMode
            },
        },
    },

    computed: {
        addQuizValues() {
            return {
                name: this.name,
                description: this.description,
                duration: parseInt(this.duration),
                numOfQuestions: 0,
                startTime: this.convertToDate(this.startDate, this.startTime),
                endTime: this.convertToDate(this.endDate, this.endTime),
            }
        },

        editQuizValues() {
            const details = this.addQuizValues
            details.id = this.id

            return details
        },
    },

    methods: {
        convertToDate(date, time) {
            // Converts the seperate date and time inputs into one
            const dateTime = new Date(0)

            dateTime.setFullYear(date.substr(0, 4))
            dateTime.setMonth(parseInt(date.substr(5, 2)) - 1)
            dateTime.setDate(date.substr(8, 2))

            dateTime.setHours(time.substr(0, 2))
            dateTime.setMinutes(time.substr(3, 2))

            return dateTime
        },

        createQuiz() {
            // Creates a quiz
            this.success = null
            this.error = null
            this.detailsFormLoading = true

            this.$apollo
                .mutate({
                    mutation: AddQuizMutation,
                    variables: {
                        input: this.addQuizValues,
                    },
                    update: (data) => {
                        return data.quiz
                    },
                    refetchQueries: [{ query: AdminQuizzesQuery }],
                })
                .then((data) => {
                    // Result
                    this.detailsFormLoading = false
                    this.success = 'Quiz successfully created.'

                    this.$refs.detailsForm.reset()

                    // Redirect to new quiz
                    this.$router.push({
                        name: 'QuizAdminDetails',
                        params: { quizId: data.data.addQuiz.id },
                    })
                })
                .catch((error) => {
                    // Error
                    this.detailsFormLoading = false
                    this.error = error.message
                })
        },

        saveQuiz() {
            // Creates a quiz
            this.success = null
            this.error = null
            this.detailsFormLoading = true

            this.$apollo
                .mutate({
                    mutation: EditQuizMutation,
                    variables: {
                        input: this.editQuizValues,
                    },
                    update: (data) => {
                        return data.quiz
                    },
                })
                .then(() => {
                    // Result
                    this.detailsFormLoading = false
                    this.success = 'Quiz successfully saved.'
                })
                .catch((error) => {
                    // Error
                    this.detailsFormLoading = false
                    this.error = error.message
                })
        },
    },
}
</script>
