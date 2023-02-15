<template>
    <v-card elevation="2" class="pa-4">
        <h1 class="text-h4 mb-2">Question Order</h1>
        <v-list shaped>
            <v-list-item-group v-model="selectedId">
                <template v-for="(questionId, i) in orderId">
                    <v-divider
                        v-if="!questionId"
                        :key="`divider-${i}`"
                    ></v-divider>

                    <v-list-item
                        v-else
                        :key="`item-${i}`"
                        :value="questionId"
                        active-class="primary--text text--accent-4"
                    >
                        <template v-slot:default="{ active }">
                            <v-list-item-content>
                                <v-list-item-title
                                    v-text="i + 1"
                                ></v-list-item-title>
                                <v-list-item-subtitle
                                    v-text="
                                        questions.find(
                                            (question) =>
                                                question.id === questionId,
                                        ).question
                                    "
                                >
                                </v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-checkbox
                                    :input-value="active"
                                    color="primary--accent-4"
                                ></v-checkbox>
                            </v-list-item-action>
                        </template>
                    </v-list-item>
                </template>
            </v-list-item-group>
        </v-list>
        <v-btn color="primary" fab large dark right @click="moveUp">
            <v-icon class="material-icons" large> arrow_upward</v-icon>
        </v-btn>
        <v-btn color="primary" fab large dark right @click="moveDown">
            <v-icon class="material-icons" large> arrow_downward</v-icon>
        </v-btn>
    </v-card>
</template>

<!-- <v-card elevation="2" class="pa-4" flex-fro>
        <h1 class="text-h4 mb-2">
            {{ createQuizMode ? 'Create Quiz' : 'Question Order' }}
        </h1>

        <v-container fluid class="pa-0">
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

            <v-list-item-group>
                <v-subheader>Question List</v-subheader>
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
                            index === 0 ? undefined : questions[index - 1].id
                        "
                        :afterId="
                            index === questions.length - 1
                                ? undefined
                                : questions[index + 1].id
                        "
                    />
                </v-list-item>
                <v-btn color="primary" fab large dark>
                    <v-icon class="material-icons" large> arrow_upward</v-icon>
                </v-btn>
                <v-btn color="primary" fab large dark>
                    <v-icon class="material-icons" large>
                        arrow_downward</v-icon
                    >
                </v-btn>
            </v-list-item-group>
        </v-container>
    </v-card> -->

<script>
import { AdminQuizQuestionsQuery } from '@/gql/queries/adminQuiz'
export default {
    data: () => ({
        selectedId: null,
        orderId: [],
    }),
    apollo: {
        questions: {
            query: AdminQuizQuestionsQuery,
            variables() {
                return {
                    quizID: this.$route.params.quizId,
                }
            },
            update: (data) => {
                return data?.quiz?.questions ?? []
            },
        },
    },
    watch: {
        questions(v) {
            this.orderId = v.map((question) => question.id)
        },
    },
    methods: {
        moveUp() {
            console.log(this.orderId)
            const currentIndex = this.orderId.findIndex(
                (id) => this.selectedId === id,
            )
            if (currentIndex < 1) return

            console.log(this.selectedId, currentIndex)

            const tmp = this.orderId[currentIndex]
            this.orderId[currentIndex] = this.orderId[currentIndex - 1]
            this.orderId[currentIndex - 1] = tmp
            console.log(this.orderId)
            this.$nextTick(() => this.$forceUpdate())

            // Moves selected question up one
        },

        moveDown() {
            console.log(this.orderId)
            const currentIndex = this.orderId.findIndex(
                (id) => this.selectedId === id,
            )
            if (currentIndex <= this.orderId.length) return

            console.log(this.selectedId, currentIndex)

            const tmp = this.orderId[currentIndex]
            this.orderId[currentIndex] = this.orderId[currentIndex + 1]
            this.orderId[currentIndex + 1] = tmp
            console.log(this.orderId)
            this.$forceUpdate()
            // Moves selected question down one
        },
    },
}
</script>

// swapQuestion(newId) { // this.loading = true // this.$apollo // .mutate({ //
mutation: SwapQuestionMutation, // variables: { // quizId: this.quizId, //
oldId: this.currentId, // newId, // },
