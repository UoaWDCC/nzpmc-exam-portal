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
                <v-list-group :value="true" no-action>
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
                    <v-list-item
                        v-for="(questionId, index) in quizQuestions"
                        :key="questionId"
                        link
                        :to="
                            '/admin/quiz/' +
                            selectedQuiz +
                            '/question/' +
                            questionId
                        "
                    >
                        <v-list-item-title>
                            Question {{ index + 1 }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list-group>
            </v-list-item-group>
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
export default {
    data: () => ({
        selectedQuiz: undefined,
        quizzes: [
            { id: 'aaaa', name: 'Foo' },
            { id: 'bbbb', name: 'Bar' },
            { id: 'cccc', name: 'Fizz' },
            { id: 'dddd', name: 'Buzz' },
        ],
        selectedQuizPage: undefined,
        quizQuestions: ['eeee', 'ffff', 'gggg', 'hhhh'],
    }),
    mounted() {
        // Set quiz dropdown based on URL
        this.selectedQuiz = this.$route.params.quizId
    },
    watch: {
        selectedQuiz(val) {
            if (
                this.selectedQuiz !== undefined &&
                !this.quizzes.find((quiz) => quiz.id === val)
            ) {
                // The selected quiz ID in the URL doesn't exist
                this.selectedQuiz = undefined
                console.log(1)
                this.$router.push({
                    name: 'QuizAdmin',
                })
            } else if (val !== this.$route.params.quizId) {
                // Page needs to be changed to reflect quiz dropdown
                this.$router.push({
                    name: 'QuizAdminDetails',
                    params: { quizId: val },
                })
            }
        },
        $route() {
            // Set quiz dropdown based on URL
            this.selectedQuiz = this.$route.params.quizId
        },
    },
    methods: {
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
}
</script>
