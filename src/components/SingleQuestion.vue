<template>
    <div>
        <v-overlay :value="true" v-if="$apollo.loading">
            <v-progress-circular indeterminate size="80" align="center" />
        </v-overlay>
        <v-card v-if="question !== null" class="pa-4 fill-height" elevation="2">
            <v-card-title>Question {{ questionIndex + 1 }}</v-card-title>
            <v-card-text class="body-1 text--primary">
                <latex :content="question.question" />
            </v-card-text>
            <img
                v-if="question.imageURI !== ''"
                class="d-block mx-auto"
                style="max-width: 100%; max-height: 25rem"
                alt="question image"
                v-bind:src="question.imageURI"
            />
        </v-card>
    </div>
</template>
<script>
import { QuestionQuery } from '../gql/queries/question'
export default {
    props: {
        questionID: String,
        questionIndex: Number,
        quizID: String,
    },
    data() {
        return {
            question: null,
        }
    },
    apollo: {
        question: {
            query: QuestionQuery,
            variables() {
                return {
                    quizID: this.quizID,
                    questionID: this.questionID,
                }
            },
            update: (data) => {
                return data.userQuiz.question
            },
        },
    },
}
</script>
