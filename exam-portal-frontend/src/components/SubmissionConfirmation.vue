<template>
    <div align="center">
        <v-overlay :value="true" v-if="submitting">
            <v-progress-circular indeterminate size="80" align="center" />
        </v-overlay>
        <v-dialog align="center" v-model="dialog" max-width="500" persistent>
            <template v-slot:activator="{ on, attrs }">
                <v-list-item>
                    <v-list-item-content>
                        <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            large
                        >
                            Submit
                        </v-btn>
                    </v-list-item-content>
                </v-list-item>
            </template>
            <v-card>
                <v-toolbar color="primary" dark>
                    <h3>Are you sure you want to submit?</h3>
                </v-toolbar>
                <v-card-text class="pa-4 pb-2">
                    <h3 style="font-weight: normal">
                        You will not be able to redo any questions after you
                        submit.
                    </h3>
                </v-card-text>
                <v-card-actions class="justify-end">
                    <v-btn large text @click="dialog = false"> Go back </v-btn>
                    <v-btn color="primary" large @click="submitQuiz">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { SubmitUserQuizMutation } from '@/gql/mutations/submission'
export default {
    props: {
        quizID: String,
    },
    data() {
        return {
            dialog: false,
            submitting: false,
        }
    },
    methods: {
        submitQuiz() {
            this.submitting = true
            this.$apollo
                .mutate({
                    mutation: SubmitUserQuizMutation,
                    variables: {
                        input: {
                            userQuizID: this.quizID,
                        },
                    },
                })
                .then((this.submitting = false))
                .then(this.$router.push('/submission'))
        },
    },
}
</script>
