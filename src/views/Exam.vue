<template>
    <v-container v-resize="onResize" class="d-flex" style="min-height: 100vh">
        <v-row class="align-self-center" style="height: 100%">
            <v-col class="col-12 col-md-4 col-lg-3 col-xl-2 d-none d-md-block">
                <v-card class="questionCard" elevation="2" style="height: 100%">
                </v-card>
            </v-col>
            <v-col class="col-12 col-md-8 col-lg-9 col-xl-10">
                <v-row>
                    <v-col class="col-12">
                        <Topbar
                            @toggleSidebar="sidebarOpen = !sidebarOpen"
                            :startTimestamp="startTimestamp"
                            :duration="duration"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="col-12 col-xl-8">
                        <SingleQuestion :question="question.text" />
                    </v-col>
                    <v-col class="col-12 col-xl-4">
                        <AnswerList :optionsList="answers" />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <Sidebar
            :sidebarOpen="sidebarOpen"
            @drawerOpen="sidebarOpen = true"
            @drawerClosed="sidebarOpen = false"
        />
    </v-container>
</template>
<script>
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'
import SingleQuestion from './../components/SingleQuestion.vue'
import AnswerList from './../components/AnswerList.vue'

export default {
    components: {
        Sidebar,
        Topbar,
        AnswerList,
        SingleQuestion,
    },
    data() {
        return {
            question: {
                text: '$$\\frac{a}{b}$$',
            },
            answers: [
                { text: 'First Answer', id: 1 },
                { text: 'Second Answer', id: 2 },
                { text: 'Third Answer', id: 3 },
                { text: 'Fourth Answer', id: 4 },
            ],
            questions: [
                { title: 'Question 1', id: '1' },
                { title: 'Question 2', id: '2' },
                { title: 'Question 3', id: '3' },
                { title: 'Question 4', id: '4' },
            ],
            sidebarOpen: false,
            startTimestamp:
                'Sun Jun 27 2021 23:45:52 GMT+1200 (New Zealand Standard Time)',
            duration: 5550,
        }
    },
    mounted() {
        this.onResize()
    },
    methods: {
        onResize() {
            // Moves the location of the sidebar component based on the
            const sidebar = this.$el.querySelector('.questionDrawer')
            const sidebarInCard =
                sidebar.parentElement.classList.contains('questionCard')
            const screenIsMobile = window.innerWidth < 960

            if (sidebarInCard && screenIsMobile) {
                // Sidebar must be moved to the root element
                sidebar.remove()
                this.$el.append(sidebar)

                // Hide sidebar, modify styles
                this.sidebarOpen = false
                sidebar.style.width = '256px'
                sidebar.querySelector(
                    '.v-navigation-drawer__border',
                ).style.display = 'block'
            } else if (!sidebarInCard && !screenIsMobile) {
                // Sidebar must be moved to the card
                sidebar.remove()
                this.$el.querySelector('.questionCard').append(sidebar)

                // Show sidebar, modify styles
                this.sidebarOpen = true
                sidebar.style.width = '100%'
                sidebar.querySelector(
                    '.v-navigation-drawer__border',
                ).style.display = 'none'
            }
        },
    },
}
</script>
