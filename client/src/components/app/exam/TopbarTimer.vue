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
      secondsRemaining: this.duration.valueOf() * 60,
      timer: null as unknown as ReturnType<typeof setInterval>
    }
  },

  props: {
    duration: {
      type: Number,
      required: true,
    }
  },

  computed: {
    timeString() {
      const hours = Math.floor(this.secondsRemaining / (60 * 60));
      const minutes = Math.floor((this.secondsRemaining - (60 * 60 * hours)) / 60);
      const seconds = this.secondsRemaining % 60;

      return `${(hours < 10 ? '0' : '') + hours}:${(minutes < 10 ? '0' : '') + minutes}:${(seconds < 10 ? '0' : '') + seconds}`
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
