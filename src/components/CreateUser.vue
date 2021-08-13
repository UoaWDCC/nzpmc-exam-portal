<template>
    <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
            <div class="text-center">
                <v-btn color="primary" fab small v-bind="attrs" v-on="on">
                    <v-icon class="material-icons">add</v-icon>
                </v-btn>
            </div>
        </template>
        <v-card elevation="2" class="pa-6">
            <h1 class="mb-2">Create User</h1>
            <v-form ref="userForm" v-model="formIsValid">
                <v-row dense>
                    <v-col class="col">
                        <v-text-field
                            label="Name"
                            v-model="userName"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field
                            label="Email"
                            v-model="userEmail"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field
                            label="Year Level"
                            type="number"
                            v-model="userYearLevel"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field
                            label="Password (optional)"
                            v-model="userPassword"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-select
                            :items="quizzes"
                            v-model="associatedQuiz"
                            label="Associated Quiz (optional)"
                        ></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="d-flex justify-space-around">
                        <v-btn
                            type="submit"
                            color="primary"
                            :disabled="!formIsValid"
                        >
                            <v-icon left class="material-icons">
                                create
                            </v-icon>
                            Create
                        </v-btn>

                        <v-btn color="error" @click="cancel"> Cancel </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>
    </v-dialog>
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
            dialog: false,
            quizzes: ['Foo', 'Bar', 'Fizz', 'Buzz'],
            userName: null,
            userPassword: null,
            userYearLevel: null,
            userEmail: null,
            associatedQuiz: null,
            userForm: null,
            formIsValid: null,
            rules: {
                required: (value) => !!value || 'Required.',
            },
        }
    },
    methods: {
        cancel() {
            this.userName = null
            this.userPassword = null
            this.userYearLevel = null
            this.userEmail = null
            this.associatedQuiz = null
            this.dialog = false
        },
    },
}
</script>
