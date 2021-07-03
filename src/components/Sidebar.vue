<template>
    <v-navigation-drawer
        v-model="drawer"
        class="questionDrawer"
        mobile-breakpoint="sm"
        absolute
    >
        <v-list-item>
            <v-list-item-content>
                <img
                    style="width: 100%; max-width: 300px"
                    class="d-block mx-auto"
                    alt="NZPMC Logo"
                    src="../assets/logo.png"
                />
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list dense nav>
            <v-list-item-group
                v-if="userQuiz !== null"
                v-model="selectedQuestionID"
                color="primary"
                mandatory
            >
                <v-list-item
                    v-for="(question, index) in userQuiz.questions"
                    :key="question.id"
                    link
                >
                    <v-list-item-content
                        @click="selectQuestion(question.id)"
                        color="#00008B"
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
export default {
    props: {
        sidebarOpen: Boolean,
        quizID: String,
    },

    data() {
        return {
            userQuiz: null,
            drawer: null,
            selectedQuestionID: null,
        }
    },

    watch: {
        sidebarOpen(val) {
            this.drawer = val
        },
        drawer(val) {
            if (val === true) {
                this.$emit('drawerOpen')
            } else {
                this.$emit('drawerClosed')
            }
        },
    },
    methods: {
        selectQuestion(id) {
            this.selectedQuestionID = id
            this.$emit('selectQuestion', this.selectedQuestionID)
        },
    },
    apollo: {
        userQuiz: {
            query: QuestionsQuery,
            variables() {
                return {
                    quizID: this.quizID,
                }
            },
        },
        // update: (data) => data.QuestionsQuery,
    },
}
</script>
<style></style>
