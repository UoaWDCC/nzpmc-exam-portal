<template>
    <v-card elevation="2">
        <v-toolbar id="topbar" style="transition: height 0.5s">
            <v-btn icon @click="toggleSidebar()" class="d-md-none me-4">
                <span class="material-icons">
                    {{ sidebarOpen ? 'close' : 'menu' }}
                </span>
            </v-btn>

            <v-toolbar-title class="timer ps-0"
                ><span class="d-none d-sm-inline-block">Time remaining:</span>
                {{ formattedTimeRemaining }}</v-toolbar-title
            >

            <v-spacer />

            <SignOutMenu />
        </v-toolbar>
    </v-card>
</template>

<script>
import SignOutMenu from '../SignOutMenu.vue'
import { CurrentTimeQuery } from '@/gql/queries/time'
import { SubmitUserQuizMutation } from '@/gql/mutations/submission'
export default {
    components: {
        SignOutMenu,
    },
    data: () => ({
        timeRemaining: null,
        timeWarning: 600,
        timeDanger: 300,
        currentTime: new Date().valueOf(),
        serverTimeDifference: 0,
    }),
    props: ['startTimestamp', 'duration', 'sidebarOpen'],
    computed: {
        pollInterval() {
            return Math.max(Math.floor(this.timeRemaining / 6), 1)
        },
        endTime() {
            // Calculates the UNIX timestamp when the time will be up
            const startTime = new Date(this.startTimestamp).valueOf()
            return startTime + this.duration * 1000
        },
        formattedTimeRemaining() {
            const time = this.timeRemaining + this.serverTimeDifference
            let hours = Math.floor(time / 3600)
            let minutes = Math.floor((time % 3600) / 60)
            let seconds = time % 60

            if (hours < 10) {
                hours = `0${hours}`
            }
            if (minutes < 10) {
                minutes = `0${minutes}`
            }
            if (seconds < 10) {
                seconds = `0${seconds}`
            }

            return this.timeRemaining === null
                ? '...'
                : `${hours}:${minutes}:${seconds}`
        },
    },
    watch: {
        currentTime(val) {
            this.serverTimeDifference = val - new Date.valueOf()
        },
        timeRemaining(val) {
            // Stop timer if finished
            if (val <= 0) {
                this.endTimer()
                this.$apollo
                    .mutate({
                        mutation: SubmitUserQuizMutation,
                        variables: {
                            input: {
                                userQuizID: this.quizID,
                            },
                        },
                    })
                    .then(this.$router.push('/submission'))
            }

            // Change timer colour if neccessary
            const timerEl = this.$el.querySelector('.timer')

            if (0 <= val && val <= this.timeDanger) {
                timerEl.classList.add('error--text')
                timerEl.classList.remove('warning--text', 'text--darken-2')
            } else if (this.timeDanger < val && val <= this.timeWarning) {
                timerEl.classList.add('warning--text', 'text--darken-2')
            }
        },
    },
    mounted() {
        this.startTimer(new Date().valueOf())
    },
    methods: {
        toggleSidebar() {
            this.$emit('toggleSidebar')
        },
        startTimer(currentTime) {
            const component = this
            this.timerInterval = setInterval(function () {
                const newTimeRemaining =
                    Math.floor((component.endTime - currentTime) / 1000) +
                    this.timeDifference
                if (newTimeRemaining >= 0) {
                    component.timeRemaining = newTimeRemaining
                }
            }, 1000)
        },
        endTimer() {
            clearInterval(this.timerInterval)
        },
    },
    appolo: {
        currentTime: {
            query: CurrentTimeQuery,
            pollInterval() {
                return this.pollInterval
            },
        },
    },
}
</script>
