<template>
    <v-card class="pa-4" elevation="2">
        <v-row v-if="question !== null">
            <v-col
                class="col-12 col-sm-6 col-md-12 col-lg-6"
                v-for="option in question.options"
                :key="option.id"
            >
                <SingleAnswer
                    :text="option.option"
                    :optionID="option.id"
                    :selectedID="
                        question.userAnswer !== null
                            ? question.userAnswer.id
                            : null
                    "
                    @selectanswer="selectOneAnswer"
                />
            </v-col>
        </v-row>
        <v-row v-if="questions !== null">
            <v-col class="col-12 d-flex justify-space-between">
                <v-btn
                    v-if="this.questionIndex > 0"
                    color="primary"
                    large
                    @click="selectPreQuestion"
                >
                    <v-icon left class="material-icons">
                        navigate_before
                    </v-icon>
                    Previous
                </v-btn>
                <v-spacer />
                <v-btn
                    v-if="this.questionIndex < this.questions.length - 1"
                    color="primary"
                    large
                    @click="selectNextQuestion"
                >
                    Next
                    <v-icon right class="material-icons">
                        navigate_next
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import SingleAnswer from './SingleAnswer.vue'
import { OptionsQuery } from '../gql/queries/option'
import { UpdateUserAnswerMutation } from '../gql/mutations/option'
import { QuestionsQuery } from '../gql/queries/question'

export default {
    components: {
        SingleAnswer,
    },
    props: {
        questionID: String,
        questionIndex: Number,
        quizID: String,
    },
    data() {
        return {
            question: null,
            questions: null,
        }
    },
    methods: {
        selectNextQuestion() {
            if (this.questionIndex < this.questions.length - 1) {
                this.$emit(
                    'selectQuestion',
                    this.questionIndex + 1,
                    this.questions[this.questionIndex + 1].id,
                )
            }
        },
        selectPreQuestion() {
            if (this.questionIndex > 0) {
                this.$emit(
                    'selectQuestion',
                    this.questionIndex - 1,
                    this.questions[this.questionIndex - 1].id,
                )
            }
        },
        selectOneAnswer(ID) {
            this.question.userAnswer
                ? ID === this.question.userAnswer.id
                    ? (this.question.userAnswer = null)
                    : (this.question.userAnswer.id = ID)
                : (this.question.userAnswer = { id: ID })

            this.$apollo.mutate({
                mutation: UpdateUserAnswerMutation,
                variables: {
                    input: {
                        userQuizID: this.quizID,
                        questionID: this.questionID,
                        answerID: this.question.userAnswer
                            ? this.question.userAnswer.id
                            : '',
                    },
                },
            })
        },
    },
    apollo: {
        question: {
            query: OptionsQuery,
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
        questions: {
            query: QuestionsQuery,
            variables() {
                return {
                    quizID: this.quizID,
                }
            },
            update: (data) => {
                return data.userQuiz.questions
            },
        },
    },
}
</script>
