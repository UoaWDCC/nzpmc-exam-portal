<template>
    <v-card elevation="2" class="pa-4">
        <h1 class="mb-2">
            {{ createQuizMode ? 'Create Quiz' : 'Quiz Details' }}
        </h1>
        <v-form ref="detailsForm" v-model="formIsValid">
            <v-row dense>
                <v-col class="col col-12 col-sm-4 col-lg-3 col-xl-2">
                    <v-text-field
                        label="ID"
                        v-model="id"
                        disabled
                    ></v-text-field>
                </v-col>
                <v-col class="col">
                    <v-text-field
                        label="Name"
                        v-model="name"
                        :rules="[rules.required]"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-text-field
                        label="Description"
                        v-model="description"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-text-field
                        type="number"
                        label="Duration (seconds)"
                        v-model="duration"
                        :rules="[rules.required]"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col class="col-6">
                    <v-menu
                        :close-on-content-click="false"
                        :nudge-bottom="8"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
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
                    <v-menu
                        :close-on-content-click="false"
                        :nudge-bottom="8"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
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
                    <v-menu
                        :close-on-content-click="false"
                        :nudge-bottom="8"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
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
                    <v-menu
                        :close-on-content-click="false"
                        :nudge-bottom="8"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
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
            <v-row>
                <v-col class="col-12 d-flex justify-end">
                    <v-btn
                        type="submit"
                        color="primary"
                        :disabled="!formIsValid"
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
</style>

<script>
import { AdminQuizDetailsQuery } from '../gql/queries/adminQuiz'

export default {
    data() {
        return {
            detailsForm: null,
            formIsValid: null,
            rules: {
                required: (value) => !!value || 'Required.',
            },

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
    computed: {
        createQuizMode() {
            return this.$route.name === 'QuizAdminCreateQuiz'
        },
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
        },
    },
}
</script>
