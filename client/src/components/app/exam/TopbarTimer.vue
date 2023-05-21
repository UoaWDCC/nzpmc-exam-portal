<template>
    <v-sheet
        class="app-exam-topbar-timer ml-2 px-2 rounded text-no-wrap"
        style="line-height: 34px"
        outlined
    >
        {{ timeString }} remaining
    </v-sheet>
</template>

<script lang="ts">
export default {
    name: 'AppExamTopbarTimer',

    data() {
        return {
            secondsRemaining: 20,
            timer: null as unknown as ReturnType<typeof setInterval>,
        }
    },

    computed: {
        timeString() {
            const minutes = Math.floor(this.secondsRemaining / 60)
            const seconds = this.secondsRemaining % 60
            return `${minutes}m ${seconds}s`
        },
    },

    mounted() {
        this.startTimer()
    },

    beforeUnmount() {
        this.stopTimer()
    },

    methods: {
        startTimer() {
            this.timer = setInterval(this.decreaseTimer, 1000)
        },

        decreaseTimer() {
            this.secondsRemaining--

            if (this.secondsRemaining === 0) this.stopTimer()
        },

        stopTimer() {
            clearInterval(this.timer)
        },
    },
}
</script>
