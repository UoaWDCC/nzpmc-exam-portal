<template>
    <ApolloQuery
        :query="UserQuizFullQuestionQuery"
        :update="(data) => data.userQuiz.question"
        :variables="{
            quizID: $route.params.quizID,
            questionID: $route.params.questionID,
        }"
        fetch-policy="cache-first"
        class="app-exam-question fill-height"
    >
        <template #default="{ result: { data, error }, isLoading }">
            <AppExamQuestionLoader v-if="isLoading" />

            <v-scroll-y-reverse-transition>
                <v-alert v-if="error" type="error" class="ma-3">
                    {{ $errorMessage }}
                </v-alert>
            </v-scroll-y-reverse-transition>

            <v-scroll-y-reverse-transition>
                <div
                    v-if="data"
                    class="fill-height flex-grow-1"
                    style="overflow-y: auto"
                >
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12" md="6" class="mb-n3">
                                <div class="align-center d-flex mb-3">
                                    <h2
                                        class="flex-grow-1 text-h5"
                                        style="line-height: 1"
                                    >
                                        Question {{ questionNumber }}
                                    </h2>

                                    <AppExamQuestionFlagButton
                                        :flagged="data.flag"
                                        :question-number="questionNumber"
                                    />
                                </div>

                                <DisplayText :text="data.question" />
                            </v-col>

                            <v-col cols="12" md="6">
                                <AppExamQuestionOptions
                                    :options="data.options"
                                    :answer="
                                        data.userAnswer
                                            ? data.userAnswer.id
                                            : null
                                    "
                                    :question-number="questionNumber"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-scroll-y-reverse-transition>
        </template>
    </ApolloQuery>
</template>

<script>
import { UserQuizQuery } from '@/gql/queries/userQuiz'
import { UserQuizFullQuestionQuery } from '@/gql/queries/userQuiz'
import AppExamQuestionOptions from './Options'
import AppExamQuestionFlagButton from './FlagButton'
import AppExamQuestionLoader from './Loader'
import DisplayText from '@/components/DisplayText'

export default {
    name: 'AppExamQuestion',

    components: {
        AppExamQuestionOptions,
        AppExamQuestionFlagButton,
        AppExamQuestionLoader,
        DisplayText,
    },

    data() {
        return {
            UserQuizFullQuestionQuery,
        }
    },

    apollo: {
        // Determine question number
        questionNumber() {
            const questionID = this.$route.params.questionID

            return {
                query: UserQuizQuery,

                variables() {
                    return {
                        quizID: this.$route.params.quizID,
                    }
                },

                // Find index of question with same ID
                update: (data) =>
                    data.userQuiz.questions.findIndex(
                        (question) => question.id === questionID,
                    ) + 1,

                fetchPolicy: 'cache-only',
            }
        },
    },
}
</script>
