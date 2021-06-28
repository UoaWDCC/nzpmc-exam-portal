<template>
    <v-card elevation="2">
        <v-toolbar>
            <v-btn icon @click="toggleSidebar()" class="d-md-none">
                <span class="material-icons">menu</span>
            </v-btn>

            <v-toolbar-title class="timer"
                ><span class="d-none d-sm-inline-block">Time remaining:</span>
                {{ formattedTimeRemaining }}</v-toolbar-title
            >
            <v-spacer />

            <SignOutMenu />
        </v-toolbar>
    </v-card>
</template>

<script>
import SignOutMenu from './SignOutMenu.vue'
export default {
    components: {
        SignOutMenu,
    },
    data: () => ({
        items: [
            { title: 'Click Me' },
            { title: 'Click Me' },
            { title: 'Click Me' },
            { title: 'Click Me 2' },
        ],
        timeRemaining: null,
        timeWarning: 600,
        timeDanger: 300,
    }),
    props: ['startTimestamp', 'duration'],
    computed: {
        endTime() {
            // Calculates the UNIX timestamp when the time will be up
            const startTime = new Date(this.startTimestamp).valueOf()
            return startTime + this.duration * 1000
        },
        formattedTimeRemaining() {
            const minutes = Math.floor(this.timeRemaining / 60)
            let seconds = this.timeRemaining % 60

            if (seconds < 10) {
                seconds = `0${seconds}`
            }
            return `${minutes}:${seconds}`
        },
    },
    watch: {
        timeRemaining(val) {
            // Stop timer if finished
            if (val <= 0) {
                this.endTimer()
            }

            // Change timer colour if neccessary
            const timerEl = this.$el.querySelector('.timer')
            console.log(val)
            if (0 <= val && val <= this.timeDanger) {
                timerEl.classList.add('error--text')
                timerEl.classList.remove('warning--text', 'text--darken-2')
            } else if (this.timeDanger < val && val <= this.timeWarning) {
                timerEl.classList.add('warning--text', 'text--darken-2')
            }
        },
    },
    mounted() {
        this.startTimer()
    },
    methods: {
        toggleSidebar() {
            this.$emit('toggleSidebar')
        },
        startTimer() {
            const component = this
            this.timerInterval = setInterval(function () {
                const newTimeRemaining = Math.floor(
                    (component.endTime - new Date().valueOf()) / 1000,
                )
                if (newTimeRemaining >= 0) {
                    component.timeRemaining = newTimeRemaining
                }
            }, 1000)
        },
        endTimer() {
            clearInterval(this.timerInterval)
        },
    },
}
</script>
