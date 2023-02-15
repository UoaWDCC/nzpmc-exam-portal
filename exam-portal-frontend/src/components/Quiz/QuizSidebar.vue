<template>
    <v-navigation-drawer permanent class="questionDrawer" style="width: 100%">
        <div class="d-flex flex-column fill-height">
            <v-list-item style="flex: none">
                <v-list-item-content>
                    <img
                        style="width: 100%; max-width: 300px"
                        class="d-block mx-auto"
                        alt="NZPMC Logo"
                        src="@/assets/logo.png"
                    />
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense nav class="flex-grow-1">
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
                            class="pa-2"
                            link
                        >
                            <v-row>
                                <v-col class="d-flex justify-center">
                                    <v-icon
                                        @click="
                                            changeFlag(
                                                index,
                                                !!questions[index].flag,
                                            )
                                            cancelBubble(event)
                                        "
                                        :color="
                                            questions[index].flag
                                                ? 'red'
                                                : 'black'
                                        "
                                    >
                                        emoji_flags
                                    </v-icon>
                                    <v-list-item-title class="mr-2">
                                        Question {{ index + 1 }}
                                    </v-list-item-title>
                                    <v-icon
                                        v-if="
                                            questions[index].userAnswer !== null
                                        "
                                    >
                                        check_circle
                                    </v-icon>
                                    <v-icon v-else color="white"
                                        >circle
                                    </v-icon>
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
            <SubmissionConfirmation :quizID="this.quizID" />
        </div>
    </v-navigation-drawer>
</template>
<script>
import { QuestionsQuery } from '@/gql/queries/question'
import SubmissionConfirmation from '../SubmissionConfirmation.vue'
import { UpdateFlagMutation } from '@/gql/mutations/flag'
export default {
    components: {
        SubmissionConfirmation,
    },
    props: {
        quizID: String,
        sidebarLoaded: Function,
        questionIndex: Number,
        answeredID: Number,
    },

    data() {
        return {
            questions: null,
            selectedQuestionIndex: 0,
            event: '',
        }
    },
    methods: {
        selectQuestion(index) {
            this.selectedQuestionIndex = this.questions[index].id
            this.$emit('selectQuestion', index, this.selectedQuestionIndex)
        },
        changeFlag(index, flagStatus) {
            this.$apollo.mutate({
                mutation: UpdateFlagMutation,
                variables: {
                    input: {
                        userQuizID: this.quizID,
                        questionID: this.questions[index].id,
                        answerID: null,
                        flag: !flagStatus,
                    },
                },
            })
        },
        cancelBubble(e) {
            const evt = e ? e : window.event
            if (evt.stopPropagation) evt.stopPropagation()
            if (evt.cancelBubble !== null) evt.cancelBubble = true
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
