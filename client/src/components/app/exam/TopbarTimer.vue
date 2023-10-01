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
import { EditUserQuiz, SubmitUserQuizQuestionsMutation } from '@/gql/mutations/userQuiz'
import { useExamStore } from './examStore'
import { mapWritableState } from 'pinia'
import { useMainStore } from '@/stores/main'

export default {
  name: 'AppExamTopbarTimer',

  data() {
    return {
      examStore: useExamStore(),
      secondsRemaining: null,
      startEpoch: this.quizStart as number | null,
      timer: null as unknown as ReturnType<typeof setInterval>
    }
  },

  props: {
    duration: {
      type: Number,
      required: true
    },
    quizStart: {
      required: true
    },
    userQuizId: {
      required: true
    }
  },

  computed: {
    timeString() {
      if (!this.secondsRemaining) return '00:00:00'

      const hours = Math.floor(this.secondsRemaining / (60 * 60))
      const minutes = Math.floor((this.secondsRemaining - 60 * 60 * hours) / 60)
      const seconds = this.secondsRemaining % 60

      return `${(hours < 10 ? '0' : '') + hours}:${(minutes < 10 ? '0' : '') + minutes}:${
        (seconds < 10 ? '0' : '') + seconds
      }`
    }, 
    ...mapWritableState(useMainStore, ['snackbarQueue'])
  },

  mounted() {
    if (!this.startEpoch) {
      //persist start time
      const currentTimeSeconds = Math.floor(Date.now() / 1000)

      const handleMutation = async () => {
        try {
          await this.$apollo.mutate({
            mutation: EditUserQuiz,
            variables: {
              input: {
                quizStart: currentTimeSeconds,
                userQuizID: this.userQuizId
              }
            }
          })
          this.startEpoch = currentTimeSeconds
          this.startTimer()
        } catch (e) {
          console.error(e)
        }
      }
      handleMutation()
    } else {
      this.startTimer()
    }
  },

  beforeUnmount() {
    this.stopTimer()
  },

  methods: {
    startTimer() {
      this.timer = setInterval(this.updateTimer, 1000)
    },

    updateTimer() {
      const currentTimeSeconds = Math.floor(Date.now() / 1000)
      const elapsedSeconds = currentTimeSeconds - this.startEpoch!
      this.secondsRemaining = this.duration.valueOf() * 60 - elapsedSeconds

      if (this.secondsRemaining <= 0) {
        this.secondsRemaining = 0
        this.stopTimer()

        // submit on timeout
        const mutation = this.$apollo.mutate({
        mutation: SubmitUserQuizQuestionsMutation,
        variables: {
          input: {
            userQuizID: this.$route.params.quizID
          }
        }
      })
      this.examStore.submitting = true
      mutation
        .then(() => {
          this.$router.push({
            name: 'AppExams'
          })
        })
        .catch(() => {
          this.snackbarQueue.push(`Unable to submit exam. Please try again later.`)
        })
    }
    },

    stopTimer() {
      clearInterval(this.timer)
    }
  }
}
</script>
