<template>
    <ApolloQuery
        :query="UserQuizQuery"
        :update="(data) => data.userQuiz"
        :variables="{ quizID: $route.params.quizID }"
        fetch-policy="cache-first"
        class="app-exam"
    >
        <template #default="{ result: { data, error }, isLoading }">
            <FinishedDialog v-if="error" :counter="0" />
            <v-scroll-y-reverse-transition>
                <v-alert v-if="error" type="error" class="mx-3 my-6">
                    {{ $errorMessage }}
                </v-alert>
            </v-scroll-y-reverse-transition>

            <AppExamTopbarLoader v-if="isLoading" />

            <AppExamTopbar v-if="data" :name="data.name" />

            <div
                v-if="data || isLoading"
                class="d-flex flex-grow-1"
                :style="{ height: `calc(100vh - ${TOOLBAR_HEIGHT * 2}px)` }"
            >
                <div class="flex-shrink-0" style="overflow-y: auto">
                    <v-navigation-drawer
                        permanent
                        class="background--grey grey lighten-5"
                        style="width: unset; min-width: 56px"
                        mini-variant
                    >
                        <AppExamSidebarLoader v-if="isLoading" />

                        <v-scroll-y-reverse-transition>
                            <AppExamSidebar
                                v-if="data"
                                :questions="data.questions"
                            />
                        </v-scroll-y-reverse-transition>
                    </v-navigation-drawer>
                </div>

                <AppExamQuestionLoader v-if="isLoading" />

                <div v-if="data" class="flex-grow-1" style="overflow: hidden">
                    <component :is="routeTransition" hide-on-leave>
                        <router-view :key="$route.params.questionID" />
                    </component>
                </div>
            </div>
        </template>
    </ApolloQuery>
</template>

<script>
import FinishedDialog from './FinishedDialog'
import { UserQuizQuery } from '@/gql/queries/userQuiz'
import AppExamTopbarLoader from './TopbarLoader'
import AppExamTopbar from './Topbar'
import AppExamSidebarLoader from './SidebarLoader'
import AppExamQuestionLoader from './Question/Loader'
import AppExamSidebar from './Sidebar'
import { VSlideXTransition, VSlideXReverseTransition } from 'vuetify/lib'

import { TOOLBAR_HEIGHT } from '@/helpers'

export default {
    name: 'AppExam',

    components: {
        AppExamTopbarLoader,
        AppExamTopbar,
        AppExamSidebarLoader,
        AppExamQuestionLoader,
        AppExamSidebar,
        FinishedDialog,
    },

    beforeRouteUpdate(to, from, next) {
        // Determine whether to show question transition as left or right
        this.routeTransition =
            from.params.questionID === undefined
                ? 'Transition'
                : to.params.questionID > from.params.questionID // eslint-disable-next-line prettier-vue-scorpionknifes/prettier, indent
                ? VSlideXReverseTransition // eslint-disable-next-line prettier-vue-scorpionknifes/prettier, indent
                : VSlideXTransition
        next()
    },

    data() {
        return {
            UserQuizQuery,
            TOOLBAR_HEIGHT,

            routeTransition: VSlideXTransition,
        }
    },

    apollo: {
        name: {
            query: UserQuizQuery,
            variables() {
                return { quizID: this.$route.params.quizID }
            },

            update: (data) => data.userQuiz?.name,
            fetchPolicy: 'cache-only',
        },
    },
}
</script>

<style>
.app-exam .slide-x-transition-enter {
    opacity: 0;
    transform: translateX(-50vw);
}

.app-exam .slide-x-reverse-transition-enter {
    opacity: 0;
    transform: translateX(50vw);
}
</style>
