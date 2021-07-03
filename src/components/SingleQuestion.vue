<template>
    <v-card v-if="userQuiz !== null" class="pa-4 fill-height" elevation="2">
        <v-card-title>Question {{ questionIndex + 1 }}</v-card-title>
        <v-card-text>
            <latex :content="userQuiz.question.question" />
        </v-card-text>
        <img
            v-if="userQuiz.question.imageURI !== ''"
            style="width: 100%; max-width: 300px"
            alt="question image"
            v-bind:src="userQuiz.question.imageURI"
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
            userQuiz: null,
        }
    },
    apollo: {
        userQuiz: {
            query: QuestionQuery,
            variables() {
                return {
                    quizID: this.quizID,
                    questionID: this.questionID,
                }
            },
        },
    },
}
</script>
