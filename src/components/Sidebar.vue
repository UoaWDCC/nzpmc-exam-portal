<template>
    <v-navigation-drawer permanent class="questionDrawer" style="width: 100%">
        <v-list-item>
            <v-list-item-content>
                <img
                    style="width: 100%; max-width: 300px"
                    class="d-block mx-auto"
                    alt="NZPMC Logo"
                    src="../assets/logo.png"
                />
                <v-btn large color="primary">Submit</v-btn>
            </v-list-item-content>
        </v-list-item>
        <SubmissionConfirmation :quizID="this.quizID" />
        <v-divider></v-divider>
        <v-list dense nav>
            <v-list-item-group
                v-if="questions !== null"
                v-model="selectedQuestionIndex"
                color="primary"
                mandatory
            >
                <v-list-item
                    v-for="(question, index) in questions"
                    :key="question.id"
                >
                    <v-list-item-content
                        @click="selectQuestion(index)"
                        class="px-2"
                        link
                    >
                        <v-list-item-title>
                            Question {{ index + 1 }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>
<script>
import { QuestionsQuery } from '../gql/queries/question'
import SubmissionConfirmation from './SubmissionConfirmation.vue'
export default {
    components: {
        SubmissionConfirmation,
    },
    props: {
        quizID: String,
        sidebarLoaded: Function,
        questionIndex: Number,
    },

    data() {
        return {
            questions: null,
            selectedQuestionIndex: null,
        }
    },
    methods: {
        selectQuestion(index) {
            this.selectedQuestionIndex = this.questions[index].id
            this.$emit('selectQuestion', index, this.selectedQuestionIndex)
        },
    },
    created() {
        this.$emit('sidebarLoaded')
    },
    apollo: {
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
    watch: {
        questionIndex() {
            this.selectedQuestionIndex = this.questionIndex
        },
    },
}
</script>
<style></style>
