<template>
    <v-card class="pa-4" elevation="2">
        <v-row v-if="userQuiz !== null">
            <v-col
                class="col-12 col-sm-6 col-md-12 col-lg-6 col-xl-12"
                v-for="option in userQuiz.question.options"
                :key="option.id"
            >
                <SingleAnswer
                    :text="option.option"
                    :optionID="option.id"
                    :selectedID="currentOptionID"
                    @selectanswer="selectOneAnswer"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col class="col-12 text-end">
                <v-btn color="primary" large>
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

export default {
    components: {
        SingleAnswer,
    },
    methods: {
        selectOneAnswer(number) {
            this.currentOptionID = number
        },
    },
    props: {
        questionID: String,
        quizID: String,
    },
    data() {
        return {
            userQuiz: null,
            currentOptionID: null,
        }
    },
    apollo: {
        userQuiz: {
            query: OptionsQuery,
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
