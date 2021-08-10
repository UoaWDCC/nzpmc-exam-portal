<template>
    <v-card elevation="2" class="pa-4">
        <h1 class="mb-2">
            {{ createQuizMode ? 'Create Quiz' : 'Quiz Details' }}
        </h1>
        <v-form ref="detailsForm" v-model="formIsValid">
            <v-row dense>
                <v-col class="col col-12 col-sm-3 col-lg-2 col-xl-1">
                    <v-text-field
                        label="ID"
                        value="aaaa"
                        disabled
                    ></v-text-field>
                </v-col>
                <v-col class="col">
                    <v-text-field
                        label="Name"
                        :rules="[rules.required]"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-text-field label="Description"></v-text-field>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-text-field
                        type="number"
                        label="Duration"
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
export default {
    data() {
        return {
            detailsForm: null,
            formIsValid: null,
            rules: {
                required: (value) => !!value || 'Required.',
            },
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
}
</script>
