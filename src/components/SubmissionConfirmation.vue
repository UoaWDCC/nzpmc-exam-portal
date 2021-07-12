<template>
    <div align="center" class="pa-5">
        <v-dialog align="center" v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark v-bind="attrs" v-on="on">
                    Submit
                </v-btn>
            </template>
            <v-container style="background-color: #ecf0f1; max-width: 500px">
                <v-container
                    style="background-color: #c1c1c1; max-width: 500px"
                >
                    <h3><b>Are you sure you want to submit?</b></h3>
                </v-container>
                <p style="padding: 15px 0px">
                    You will not be able to redo any questions after you submit.
                </p>
                <v-btn
                    style="
                        margin-right: 10px;
                        color: white;
                        background-color: #09b683;
                    "
                    x-large
                    @click="submitQuiz"
                >
                    Yes
                </v-btn>
                <v-btn
                    style="
                        margin-left: 10px;
                        color: white;
                        background-color: #ff7069;
                    "
                    x-large
                    @click="dialog = false"
                >
                    No
                </v-btn>
            </v-container>
        </v-dialog>
    </div>
</template>

<script>
import { SubmitUserQuizMutation } from '../gql/mutations/submission'
export default {
    props: {
        quizID: String,
    },
    data() {
        return {
            dialog: false,
        }
    },
    methods: {
        submitQuiz() {
            this.$apollo.mutate({
                mutation: SubmitUserQuizMutation,
                variables: {
                    input: {
                        userQuizID: this.quizID,
                    },
                },
            })
            this.$router.push('/submission')
        },
    },
}
</script>
