<template>
  <v-container class="quiz-management">
    <h2>Quiz Management</h2> 
    <v-btn @click="enrollUserIntoQuiz">Enroll User into Quiz</v-btn>
    <v-divider />
  </v-container>
  <v-container>
    <v-text-field
      v-model="quizIdInput"
      label="Quiz ID"
      class="text-field"
    ></v-text-field>
    <v-btn @click="downloadUserQuizzes">Download User Quizzes</v-btn>
</v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { User } from '@/components/app/admin/UserManagement.vue'
import {
  downloadUserQuizzesCsvQuery,
} from '@/utils/quizManagement'

export type UserQuiz = {
  user: User,
  score: number
}

export default defineComponent({
  name: 'QuizManagement',

  data() {
    return {
      quizIdInput: '',
    };
  },

  methods: {
    async enrollUserIntoQuiz() {
      try {
        // TODO: Add your logic to enroll a user into the quiz here
        console.log('User enrolled into the quiz');
      } catch (error) {
        console.error('Failed to enroll user into the quiz:', error);
      }
    },

    async downloadUserQuizzes() {
      try {
        // TODO: Add your logic to download current user quizzes based on the quizIdInput here
        await downloadUserQuizzesCsvQuery(this.$apollo, this.quizIdInput);
        console.log('Downloading user quizzes for quiz ID:', this.quizIdInput);
      } catch (error) {
        console.error('Failed to download user quizzes:', error);
      }
    },
  },
});
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
