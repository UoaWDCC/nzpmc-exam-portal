<template>
  <v-dialog v-model="popUpDialog" class="popup-dialog">
    <v-card>
      <v-card-title class="popup-headline">NZPMC Admin</v-card-title>
      <v-card-text class="popup-text">
        <div class="custom-progress">
          <v-progress-circular
            v-if="loading"
            :size="100"
            :width="15"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <!-- <temp> -->

          <template v-else>
            {{ popUpMessage }}
          </template>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="popUpDialog = false" class="popup-button">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-container class="quiz-management">
    <h2>Quiz Management</h2>
    <v-btn @click="enrollUserIntoQuiz">Enroll User into Quiz</v-btn>
    <v-divider />
  </v-container>
  <v-container>
    <v-select
      label="Quiz ID"
      :items="quizzes"
      item-title="name"
      item-value="id"
      @update:model-value="updateQuizID"
    ></v-select>
    <v-btn @click="downloadUserQuizzes">Download User Quizzes</v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import type { User } from '@/components/app/admin/UserManagement.vue'
import { AllQuizIDQuery } from '@/gql/queries/quiz'
import { downloadUserQuizzesCsvQuery } from '@/utils/quizManagement'

export type UserQuiz = {
  user: User
  score: number
}

export default defineComponent({
  name: 'QuizManagement',

  data() {
    return {
      quizzes: [],
      quizIdInput: '',
      loading: false,
      popUpDialog: false,
      popUpMessage: ''
    }
  },

  apollo: {
    userQuizzes: {
      query: AllQuizIDQuery,
      result({ data, error, loading }) {
        this.loading = loading
        if (error) {
          this.error = error.message
        } else {
          if (data) {
            this.quizzes = data.quizzes
          }
        }
      },
      fetchPolicy: 'cache-and-network'
    }
  },
  methods: {
    updateQuizID(id) {
      this.quizIdInput = id
    },
    async enrollUserIntoQuiz() {
      try {
        // TODO: Add your logic to enroll a user into the quiz here
        console.log('User enrolled into the quiz')
      } catch (error) {
        console.error('Failed to enroll user into the quiz:', error)
      }
    },

    async downloadUserQuizzes() {
      try {
        const success = await downloadUserQuizzesCsvQuery(this.$apollo, this.quizIdInput) // waits for the query to finish

        this.popUpMessage = 'Downloaded user quizzes for quiz id: ' + this.quizIdInput
        if (!success) {
          this.popUpMessage = 'Failed to download user quizzes for quiz id: ' + this.quizIdInput
        }

        this.popUpDialog = true
      } catch (error) {
        console.error('Failed to download user quizzes:', error)

        this.popUpMessage = 'Failed to download user quizzes for quiz id: ' + this.quizIdInput
        this.popUpDialog = true
      }
    }
  }
})
</script>

<style scoped lang="scss">
.container .v-divider {
  margin-top: 2rem;
}
.quiz-management {
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  align-items: flex-start; /* Updated to left-aligned */
}

.quiz-management h2 {
  margin-bottom: 1rem;
}

.quiz-management v-btn {
  margin-bottom: 1rem;
}

.quiz-management .text-field {
  width: 100%;
  margin: 1rem 0; /* Added spacing above and below the input box */
}

.quiz-management v-divider {
  margin-top: 2rem;
}
</style>
