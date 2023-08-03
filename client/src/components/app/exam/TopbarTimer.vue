<style scoped lang="scss">
.container {
  text-align: center;
  color: white;
  padding: 5px 16px;
}
#timer-heading {
  font-weight: 500;
}
#time-text {
  font-size: 3rem;
  font-weight: 900;
}
</style>
<template>
  <v-container class="container">
    <p id="timer-heading">TIME LEFT</p>
    <h2 id="time-text">{{ timeString }}</h2>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'AppExamTopbarTimer',

  data() {
    return {
      secondsRemaining: 20,
      timer: null as unknown as ReturnType<typeof setInterval>
    }
  },

  computed: {
    timeString() {
      const minutes = Math.floor(this.secondsRemaining / 60)
      const seconds = this.secondsRemaining % 60
      return `${minutes}:${seconds}`
    }
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
    }
  }
}
</script>
