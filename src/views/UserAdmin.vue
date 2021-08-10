<template>
    <v-container style="height: 100%; padding-top: 10%">
        <v-card elevation="2" class="pa-6">
            <h1 class="mb-2">
                {{ createUserMode ? 'Create User' : 'User Details' }}
            </h1>
            <v-form ref="detailsForm" v-model="formIsValid">
                <v-row dense>
                    <v-col class="col">
                        <v-text-field
                            label="Name"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field
                            label="Email"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field
                            label="Year Level"
                            type="number"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field
                            label="Password (optional)"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-select
                            :items="quizzes"
                            label="Associated Quiz (optional)"
                        ></v-select>
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
                                {{ createUserMode ? 'add' : 'save' }}
                            </v-icon>
                            {{ createUserMode ? 'Create quiz' : 'Save' }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </v-container>
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
            quizzes: ['Foo', 'Bar', 'Fizz', 'Buzz'],
            detailsForm: null,
            formIsValid: null,
            rules: {
                required: (value) => !!value || 'Required.',
            },
            associatedQuiz: null,
        }
    },
    computed: {
        createUserMode() {
            return this.$route.name === 'UserAdminCreateUser'
        },
    },
}
</script>
