<template>
    <v-row justify="center">
        <v-dialog v-model="isFinished" persistent max-width="400">
            <v-card>
                <v-card-title class="text-h5"> Time's Up </v-card-title>
                <v-card-text
                    >Please click the submit button to submit your
                    answers.</v-card-text
                >
                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="secondary" @click="goToSubmissionPage()">
                        Submit
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    props: {
        counter: Number,
    },
    computed: {
        isFinished() {
            return this.counter === 0
        },
    },
    methods: {
        goToSubmissionPage() {
            this.$router.push('/submission')
        },
    },
}
</script>
