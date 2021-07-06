<template>
    <v-card v-if="question !== null" class="pa-4 fill-height" elevation="2">
        <v-card-title>Question {{ questionIndex + 1 }}</v-card-title>
        <v-card-text style="font-size: 1rem; color: rgba(0, 0, 0, 0.75)">
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
