<template>
    <div
        class="app-exams background--grey fill-height"
        style="overflow-y: auto"
    >
        <v-container class="py-0">
            <div class="my-6">
                <h1 class="mb-6 text-h4">My Exams</h1>

                <p class="mb-0">
                    Kia ora and welcome to the New Zealand Physics and
                    Mathematics Competition. This is your chance to prove your
                    skills and knowledge in the Physics and Mathematics
                    subjects. You will be tested on your knowledge of the
                    subjects, and your ability to solve problems. Below you can
                    see the exams available for you to start, past exams, and
                    ones that you're enrolled in for the future. If you can't
                    see an exam that you think you should be enrolled in,
                    contact us at
                    <a href="mailto:contact.nzpmc@gmail.com"
                        >contact.nzpmc@gmail.com</a
                    >.
                </p>
            </div>

            <ApolloQuery
                :query="UserQuizzesQuery"
                :update="(data) => data.userQuizzes"
                fetch-policy="cache-and-network"
            >
                <template #default="{ result: { data, error }, isLoading }">
                    <div v-if="isLoading && data === undefined" class="my-6">
                        <v-skeleton-loader
                            v-for="i in 3"
                            :key="i"
                            class="mb-3 mx-auto"
                            type="list-item-two-line"
                        ></v-skeleton-loader>
                    </div>

                    <v-scroll-y-reverse-transition>
                        <v-alert v-if="error" type="error" class="my-6">
                            {{ $errorMessage }}
                        </v-alert>
                    </v-scroll-y-reverse-transition>

                    <v-scroll-y-reverse-transition>
                        <AppExamsList v-if="data" :user-quizzes="data" />
                    </v-scroll-y-reverse-transition>
                </template>
            </ApolloQuery>
        </v-container>
    </div>
</template>

<script>
import AppExamsList from './List'
import { UserQuizzesQuery } from '@/gql/queries/userQuiz'

export default {
    name: 'AppExams',

    metaInfo: {
        title: 'My Exams',
    },

    components: { AppExamsList },

    data() {
        return { UserQuizzesQuery }
    },
}
</script>
