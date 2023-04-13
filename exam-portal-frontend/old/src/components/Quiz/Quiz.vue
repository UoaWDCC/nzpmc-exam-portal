<template>
    <div>
        <v-overlay :value="true" v-if="!userQuiz" align="center">
            <v-progress-circular indeterminate size="80" />
            <h2 justify="space-around" style="margin-top: 20px">Loading...</h2>
            <p class="mt-2">
                If your browser does not load, please check your internet
                connection and try again.
            </p>
        </v-overlay>

        <v-container
            fluid
            v-else
            v-resize="onResize"
            class="d-flex"
            style="min-height: 100vh; column-gap: 1rem"
        >
            <div class="d-none d-md-block" style="width: 18rem">
                <v-card
                    class="sidebarCard"
                    elevation="2"
                    style="
                        height: calc(100vh - 24px);
                        position: fixed;
                        width: inherit;
                    "
                >
                </v-card>
            </div>
            <div style="flex: 1 1 0">
                <v-row id="header">
                    <v-col class="col-12 pa-0 pa-md-3">
                        <QuizTopbar
                            @toggleSidebar="sidebarOpen = !sidebarOpen"
                            :startTimestamp="userQuiz.startTime"
                            :duration="userQuiz.duration"
                            :sidebarOpen="sidebarOpen"
                        />
                    </v-col>
                    <v-card
                        id="sidebarMobileCard"
                        elevation="2"
                        v-bind:class="{ hide: !sidebarOpen }"
                    >
                        <QuizSidebar
                            :quizID="userQuiz.id"
                            :questionIndex="selectedQuestionIndex"
                            @selectQuestion="selectOneQuestion"
                            @sidebarLoaded="sidebarLoaded = true"
                        />
                    </v-card>
                </v-row>
                <v-row class="justify-center" id="content">
                    <v-col class="col-12">
                        <QuizQuestion
                            :questionID="
                                selectedQuestionID
                                    ? selectedQuestionID
                                    : userQuiz.questions[0].id
                            "
                            :questionIndex="selectedQuestionIndex"
                            :quizID="userQuiz.id"
                        />
                    </v-col>
                    <v-col class="col-12">
                        <QuizAnswers
                            @selectQuestion="selectOneQuestion"
                            :questionID="
                                selectedQuestionID
                                    ? selectedQuestionID
                                    : userQuiz.questions[0].id
                            "
                            :questionIndex="selectedQuestionIndex"
                            :quizID="userQuiz.id"
                        />
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </div>
</template>
<style>
/* Sidebar opening transition */
@media only screen and (max-width: 959px) {
    #header {
        width: 100%;
        position: fixed;
        display: block;
        z-index: 1;
    }
    #sidebarMobileCard {
        border-radius: 0 !important;
        width: 100%;
        height: calc(100vh - 56px);
        overflow: hidden;
        transition: height 0.5s ease-in-out;
    }
    #sidebarMobileCard.hide {
        height: 0px;
    }
    #sidebarMobileCard .questionDrawer {
        min-height: calc(100vh - 56px);
    }
    .v-navigation-drawer__border {
        display: none;
    }
    #topbar {
        border-radius: 0 !important;
        z-index: 1;
    }
    #content {
        margin-top: 56px;
    }
}
</style>
<script>
import QuizSidebar from './QuizSidebar.vue'
import QuizTopbar from './QuizTopbar.vue'
import QuizQuestion from './QuizQuestion.vue'
import QuizAnswers from './QuizAnswers.vue'
import { UserQuizQuery } from '@/gql/queries/userQuiz'

export default {
    components: {
        QuizSidebar,
        QuizTopbar,
        QuizAnswers,
        QuizQuestion,
    },
    data() {
        return {
            userQuiz: null,
            selectedQuestionID: null,
            selectedQuestionIndex: 0,
            sidebarOpen: false,
            sidebarLoaded: false,
        }
    },
    apollo: {
        userQuiz: {
            query: UserQuizQuery,
            variables() {
                return { quizID: this.$route.params.quizId }
            },
            update: (data) => {
                return data.userQuiz
            },
        },
    },
    mounted() {
        this.onResize()
    },
    methods: {
        selectOneQuestion(index, id) {
            this.selectedQuestionIndex = index
            this.selectedQuestionID = id
            this.sidebarOpen = false
        },
        onResize() {
            if (this.sidebarLoaded) {
                // Moves the location of the sidebar component based on the
                const sidebar = this.$el.querySelector('.questionDrawer')
                const sidebarInCard =
                    sidebar.parentElement.classList.contains('sidebarCard')
                const screenIsMobile = window.innerWidth < 960

                if (sidebarInCard && screenIsMobile) {
                    // Sidebar must be moved to the mobile card
                    sidebar.remove()

                    this.$el.querySelector('#sidebarMobileCard').append(sidebar)
                } else if (!sidebarInCard && !screenIsMobile) {
                    // Sidebar must be moved to the normal card
                    sidebar.remove()
                    this.$el.querySelector('.sidebarCard').append(sidebar)

                    this.sidebarOpen = false
                }
            }
        },
    },
}
</script>
