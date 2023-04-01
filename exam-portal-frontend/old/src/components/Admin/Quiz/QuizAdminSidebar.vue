<template>
    <v-card elevation="2" style="height: 100%">
        <div class="pa-4 d-flex align-center">
            <v-select
                v-model="selectedQuiz"
                :items="quizzes"
                item-text="name"
                item-value="id"
                label="Quiz"
                solo
                class="mr-2"
                :loading="quizzesLoading"
                :menu-props="{ bottom: true, offsetY: true }"
            >
                <v-icon slot="append" class="material-icons">
                    arrow_drop_down
                </v-icon>
            </v-select>

            <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="createQuiz">
                        <v-icon class="material-icons">add</v-icon>
                    </v-btn>
                </template>
                <span>Create quiz</span>
            </v-tooltip>
        </div>

        <v-divider />

        <p v-if="!selectedQuiz" class="pa-4 text--secondary text-center">
            No quiz selected
        </p>

        <v-list v-if="selectedQuiz" dense nav>
            <v-list-item-group
                v-model="selectedQuizPage"
                color="primary"
                mandatory
            >
                <v-list-item :to="'/admin/quiz/' + selectedQuiz + '/details'">
                    <v-list-item-icon class="me-4">
                        <v-icon class="material-icons"> settings </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content link>
                        <v-list-item-title> Details </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item :to="'/admin/quiz/' + selectedQuiz + '/users'">
                    <v-list-item-icon class="me-4">
                        <v-icon class="material-icons"> account_circle </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content link>
                        <v-list-item-title> Users </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item :to="'/admin/quiz/' + selectedQuiz + '/order'">
                    <v-list-item-icon class="me-4">
                        <v-icon class="material-icons">
                            swap_vertical_circle
                        </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content link>
                        <v-list-item-title> Question Order </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-group
                    :value="true"
                    no-action
                    v-if="questions ? questions.length > 0 : false"
                >
                    <template v-slot:activator>
                        <v-list-item-icon class="me-4">
                            <v-icon class="material-icons">
                                question_answer
                            </v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>Questions</v-list-item-title>
                        </v-list-item-content>

                        <v-tooltip right>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    icon
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="createQuestion"
                                >
                                    <v-icon class="material-icons">add</v-icon>
                                </v-btn>
                            </template>

                            <span>Create question</span>
                        </v-tooltip>
                    </template>

                    <template v-if="questionsLoading">
                        <v-skeleton-loader
                            height="40"
                            type="text"
                            style="
                                margin-top: 0;
                                margin-bottom: 4px;
                                padding: 12px 8px 12px 64px;
                            "
                            v-for="index in 10"
                            :key="index"
                        ></v-skeleton-loader>
                    </template>

                    <v-list-item
                        v-for="(question, index) in questions"
                        :key="index + question.id"
                        link
                        :to="
                            '/admin/quiz/' +
                            selectedQuiz +
                            '/question/' +
                            question.id
                        "
                    >
                        <v-list-item-content>
                            <v-list-item-title>
                                Question {{ index + 1 }}
                            </v-list-item-title>
                        </v-list-item-content>

                        <QuizAdminSidebarReorder
                            :quizId="selectedQuiz"
                            :currentId="question.id"
                            :beforeId="
                                index === 0
                                    ? undefined
                                    : questions[index - 1].id
                            "
                            :afterId="
                                index === questions.length - 1
                                    ? undefined
                                    : questions[index + 1].id
                            "
                        />
                    </v-list-item>
                </v-list-group>
            </v-list-item-group>

            <v-list-item v-if="questions ? questions.length == 0 : true">
                <v-list-item-icon class="me-4">
                    <v-icon class="material-icons"> question_answer </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title>Questions</v-list-item-title>
                </v-list-item-content>

                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                            @click="createQuestion"
                        >
                            <v-icon class="material-icons">add</v-icon>
                        </v-btn>
                    </template>

                    <span>Create question</span>
                </v-tooltip>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<style>
/* Fix select component bug */
.v-input__slot {
    margin-bottom: 0;
}
.v-text-field__details {
    display: none;
}
/* Fix sidebar dropdown icon bug */
.v-list-item__icon.v-list-group__header__append-icon {
    display: none;
}
</style>

<script>
import { AdminQuizzesQuery } from '@/gql/queries/adminQuiz'
import { AdminQuizQuestionsQuery } from '@/gql/queries/adminQuiz'
import QuizAdminSidebarReorder from './QuizAdminSidebarReorder.vue'

export default {
    components: {
        QuizAdminSidebarReorder,
    },

    data: () => ({
        quizzesLoading: true,

        questionsLoading: true,
        questions: null,

        selectedQuiz: undefined,
        selectedQuizPage: undefined,
    }),

    mounted() {
        // Set quiz dropdown based on URL
        this.selectedQuiz = this.$route.params.quizId
    },

    watch: {
        selectedQuiz() {
            this.checkQuizId()
        },

        quizzes() {
            this.checkQuizId()

            this.quizzesLoading = false
        },

        quiz() {
            this.questions = this.quiz.questions
            this.questionsLoading = false

            // Set quiz dropdown based on URL
            const questionLoaded = !this?.quiz?.questions.some(
                (question) => question.id === this.$route.params.questionId,
            )
            if (questionLoaded && this.$route.params.questionId) {
                // Question is not in the dropdown
                this.$apollo.queries.quiz.refetch() // Refetch quiz
            }
        },

        $route() {
            // Set quiz dropdown based on URL
            this.selectedQuiz = this.$route.params.quizId
        },
    },

    methods: {
        checkQuizId() {
            // Checks that the URl provided for a quiz is correct)
            if (
                this.quizzes !== undefined &&
                this.selectedQuiz !== undefined &&
                !this.quizzes.find((quiz) => quiz.id === this.selectedQuiz)
            ) {
                // The selected quiz ID in the URL doesn't exist
                this.selectedQuiz = undefined
                this.$router.push({
                    name: 'QuizAdmin',
                })
            } else if (
                this.selectedQuiz !== undefined &&
                this.selectedQuiz !== this.$route.params.quizId
            ) {
                // Page needs to be changed to reflect quiz dropdown
                this.$router.push({
                    name: 'QuizAdminDetails',
                    params: { quizId: this.selectedQuiz },
                })
            }

            this.$apollo.queries.quiz.skip = !this.selectedQuiz
        },

        createQuiz() {
            this.$router.push({
                name: 'QuizAdminCreateQuiz',
            })
        },

        createQuestion(e) {
            e.stopPropagation()
            this.$router.push({
                name: 'QuizAdminCreateQuestion',
            })
        },
    },

    apollo: {
        quizzes: {
            query: AdminQuizzesQuery,
            update: (data) => {
                return data.quizzes
            },
        },

        quiz: {
            query: AdminQuizQuestionsQuery,
            variables() {
                return {
                    quizID: this.selectedQuiz,
                }
            },
            update: (data) => {
                return data.quiz
            },

            skip: true,
        },
    },
}
</script>
