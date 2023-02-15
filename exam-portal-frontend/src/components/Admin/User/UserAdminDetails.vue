<template>
    <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
            <div class="text-center">
                <v-icon v-if="user" v-bind="attrs" v-on="on" small class="mr-2"
                    >edit</v-icon
                >
                <v-btn
                    v-else
                    color="primary"
                    fab
                    small
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon class="material-icons">add</v-icon>
                </v-btn>
            </div>
        </template>
        <v-card elevation="2" class="pa-6">
            <h1 v-if="user" class="mb-2">Edit User</h1>
            <h1 v-else class="mb-2">Create User</h1>
            <v-form ref="userForm" v-model="formIsValid">
                <v-row dense>
                    <v-col class="col">
                        <v-text-field
                            label="First Name"
                            v-model="firstName"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col class="col">
                        <v-text-field
                            label="Last Name"
                            v-model="lastName"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col class="col">
                        <v-text-field
                            label="Display Name"
                            v-model="displayName"
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
                            v-if="user"
                            type="submit"
                            color="primary"
                            :disabled="!formIsValid"
                            @click="updateInformation"
                        >
                            <v-icon left class="material-icons"> save</v-icon>
                            Save
                        </v-btn>
                        <v-btn
                            v-else
                            type="submit"
                            color="primary"
                            :disabled="!formIsValid"
                            @click="updateInformation"
                        >
                            <v-icon left class="material-icons"> create</v-icon>
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
import { EditUser, AddUser } from '@/gql/mutations/user'
export default {
    data() {
        return {
            dialog: false,
            quizzes: ['Foo', 'Bar', 'Fizz', 'Buzz'],
            displayName: this.user ? this.user.displayName : null,
            userPassword: null,
            userYearLevel: this.user ? this.user.yearLevel : null,
            userEmail: this.user ? this.user.email : null,
            firstName: this.user ? this.user.firstName : null,
            lastName: this.user ? this.user.lastName : null,
            associatedQuiz: null,
            userForm: null,
            formIsValid: null,
            rules: {
                required: (value) => !!value || 'Required.',
            },
        }
    },
    props: {
        user: Object,
    },
    methods: {
        cancel() {
            this.dialog = false
        },
        updateInformation() {
            if (this.user) {
                this.$apollo.mutate({
                    mutation: EditUser,
                    variables: {
                        input: {
                            id: this.user.id,
                            displayName: this.displayName,
                            email: this.userEmail,
                            yearLevel: this.userYearLevel,
                            firstName: this.firstName,
                            lastName: this.lastName,
                        },
                    },
                })
            } else {
                this.$apollo.mutate({
                    mutation: AddUser,
                    variables: {
                        input: {
                            displayName: this.displayName,
                            email: this.userEmail,
                            yearLevel: this.userYearLevel,
                            firstName: this.firstName,
                            lastName: this.lastName,
                        },
                    },
                })
            }
        },
    },
}
</script>
