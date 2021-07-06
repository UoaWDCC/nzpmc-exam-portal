<template>
    <div>
        <v-progress-circular v-if="userQuiz === null" />
        <v-container
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
                <v-row>
                    <v-col class="col-12">
                        <Topbar
                            @toggleSidebar="sidebarOpen = !sidebarOpen"
                            :startTimestamp="userQuiz.startTime"
                            :duration="userQuiz.duration"
                        />
                    </v-col>
                </v-row>
                <v-row class="justify-center">
                    <v-col
                        class="col-12 d-md-none"
                        v-bind:class="{ 'd-none': !sidebarOpen }"
                    >
                        <v-card class="sidebarMobileCard" elevation="2">
                            <Sidebar
                                :quizID="userQuiz.id"
                                @selectQuestion="selectOneQuestion"
                                @sidebarLoaded="sidebarLoaded = true"
                            />
                        </v-card>
                    </v-col>
                    <v-col class="col-12">
                        <SingleQuestion
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
                        <AnswerList
                            :questionID="
                                selectedQuestionID
                                    ? selectedQuestionID
                                    : userQuiz.questions[0].id
                            "
                            :quizID="userQuiz.id"
                        />
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </div>
</template>
<script>
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'
import SingleQuestion from './../components/SingleQuestion.vue'
import AnswerList from './../components/AnswerList.vue'
import { UserQuizzesQuery } from '../gql/queries/userQuiz'

export default {
    components: {
        Sidebar,
        Topbar,
        AnswerList,
        SingleQuestion,
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
            query: UserQuizzesQuery,
            update: (data) => {
                return data.userQuizzes[0]
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

                    this.$el.querySelector('.sidebarMobileCard').append(sidebar)
                    this.sidebarOpen = false
                } else if (!sidebarInCard && !screenIsMobile) {
                    // Sidebar must be moved to the normal card
                    sidebar.remove()
                    this.$el.querySelector('.sidebarCard').append(sidebar)
                }
            }
        },
    },
}
</script>
