<template>
    <ApolloQuery
        :query="UserQuizzesQuery"
        :update="
            (data) =>
                data.userQuizzes.find(
                    (quiz) => quiz.id === $route.params.quizID,
                )
        "
        fetch-policy="cache-only"
    >
        <template #default="{ result: { data } }">
            <v-toolbar
                elevation="0"
                dense
                style="border-bottom: thin solid rgba(0, 0, 0, 0.12)"
            >
                <!-- Show quiz name from userQuizzes if it already exists in the cache -->
                <v-toolbar-title v-if="data">{{ data.name }}</v-toolbar-title>

                <v-skeleton-loader
                    v-else
                    type="text"
                    width="160"
                    class="mb-n2"
                />

                <v-spacer />

                <v-skeleton-loader
                    v-for="i in 2"
                    :key="i"
                    type="button"
                    class="ml-2"
                />
            </v-toolbar>
        </template>
    </ApolloQuery>
</template>

<script>
import { UserQuizzesQuery } from '@/gql/queries/userQuiz'

export default {
    name: 'AppExamTopbarLoader',

    data() {
        return { UserQuizzesQuery }
    },
}
</script>
