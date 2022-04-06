<template>
    <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
            <div class="text-center">
                <v-icon v-bind="attrs" v-on="on" small>delete</v-icon>
            </div>
        </template>
        <v-card elevation="2" class="pa-6">
            <h1 class="mb-16">
                Are you sure you want to delete {{ user.displayName }}?
            </h1>
            <v-form ref="userForm" v-model="formIsValid">
                <v-row>
                    <v-col class="d-flex justify-space-around">
                        <v-btn large color="error"> Yes </v-btn>

                        <v-btn large @click="cancel"> No </v-btn>
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
    props: {
        user: Object,
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
