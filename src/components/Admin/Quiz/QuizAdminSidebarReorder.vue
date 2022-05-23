<template>
    <div v-if="!loading">
        <v-tooltip bottom v-if="beforeId !== undefined">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="swapQuestion(beforeId)"
                >
                    <v-icon class="material-icons">arrow_upward</v-icon>
                </v-btn>
            </template>

            <span>Move question upward</span>
        </v-tooltip>

        <v-tooltip bottom v-if="afterId !== undefined">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="swapQuestion(afterId)"
                >
                    <v-icon class="material-icons">arrow_downward</v-icon>
                </v-btn>
            </template>

            <span>Move question backward</span>
        </v-tooltip>
    </div>
</template>

<script>
import { SwapQuestionMutation } from '@/gql/mutations/questions'
import {
    AdminQuizQuestionsQuery,
    AdminQuizQuestionDetailsQuery,
} from '@/gql/queries/adminQuiz'
export default {
    data() {
        return {
            loading: false,
        }
    },
    props: ['currentId', 'beforeId', 'afterId', 'quizId'],
    methods: {
        swapQuestion(newId) {
            this.loading = true
            this.$apollo
                .mutate({
                    mutation: SwapQuestionMutation,
                    variables: {
                        quizId: this.quizId,
                        oldId: this.currentId,
                        newId,
                    },
                    refetchQueries: [
                        {
                            query: AdminQuizQuestionsQuery,
                            variables: { quizID: this.quizId },
                        },
                        {
                            query: AdminQuizQuestionDetailsQuery,
                            variables: {
                                quizId: this.quizId,
                                questionId: this.currentId,
                            },
                        },
                        {
                            query: AdminQuizQuestionDetailsQuery,
                            variables: {
                                quizId: this.quizId,
                                questionId: newId,
                            },
                        },
                    ],
                })
                .then(() => {
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
    },
}
</script>
