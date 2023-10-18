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
  font-family: $mono;
  font-size: 2.5rem;
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
import quizEditingMixin from '@/utils/quizEditingMixin'
import { useMainStore } from '@/stores/main'

export default {
  name: 'AppExamTopbarTimer',
  mixins: [quizEditingMixin],

  data() {
    return {
      examStore: useExamStore(),
      secondsRemaining: this.quizDuration * 60,
      startEpoch: this.quizStart as number | null,
      timer: null as unknown as ReturnType<typeof setInterval>
    }
  },

  props: {
    quizDuration: {
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

  async mounted() {
    if (this.isAdminAndEditing) {
      //dont care if we are editing
      return
    }
    if (!this.startEpoch) {
      //persist start time
      const currentTimeSeconds = Math.floor(Date.now() / 1000)

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
    } else {
      this.startTimer()
    }
  },

  beforeUnmount() {
    this.stopTimer()
  },

  methods: {
    startTimer() {
      this.updateTimer()
      this.timer = setInterval(this.updateTimer, 50) // 50 ms is minimum guarenteed browser refresh rate
    },

    updateTimer() {
      const currentTimeSeconds = Math.floor(Date.now() / 1000)
      const elapsedSeconds = currentTimeSeconds - this.startEpoch!
      this.secondsRemaining = this.quizDuration * 60 - elapsedSeconds
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
