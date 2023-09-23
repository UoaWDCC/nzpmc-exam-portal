
<template>
  <div class="app-exams-list">
    <v-alert v-if="!userQuizzes.length" type="info" class="my-6">
      You're not enrolled in any exam.
    </v-alert>

    <div v-if="currentExams.length" class="my-6">
      <AppExamsLinkCard
        v-for="exam in currentExams"
        :key="exam.id"
        :title="exam.name"
        :description="exam.description"
        :duration="exam.duration"
        :open-time="exam.openTime"
        :close-time="exam.closeTime"
        :to="{ name: 'AppExam', params: { quizID: exam.id } }"
        :containerClass="'primaryContainer'"

      />
    </div>

    <div
      v-if="upcomingExams.length || pastExams.length"
      class="d-flex my-6"
      style="gap: 24px"
    >
      <div v-if="upcomingExams.length" class="flex-grow-1 mb-n3" style="min-width: 50%" >
        <h2 class="mb-6 text-h5">Upcoming Exams</h2>

        <AppExamsInfoCard 
          v-for="exam in upcomingExams"
          :key="exam.id"
          :title="exam.name"
          :description="exam.description"
          :duration="exam.duration"
          :open-time="exam.openTime"
          :close-time="exam.closeTime"
          :containerClass="'primaryContainer'"


        />
      </div>

      <div v-if="pastExams.length" class="flex-grow-1 mb-n3" style="min-width: 50%">
        <h2 class="mb-6 text-h5">Past Exams</h2>

        <AppExamsLinkCard 
          v-for="exam in pastExams"
          :key="exam.id"
          :title="exam.name"
          :description="exam.description"
          :duration="exam.duration"
          :open-time="exam.openTime"
          :close-time="exam.closeTime"
          :to="{ name: 'AppExam', params: { quizID: exam.id } }"
          :containerClass="'secondaryContainer'" 
        />
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import AppExamsLinkCard from './LinkCard.vue'
import AppExamsInfoCard from './InfoCard.vue'
import type { UserQuiz } from '@nzpmc-exam-portal/common'
import type { PropType } from 'vue'

export default {
  name: 'AppExamsList',

  components: { AppExamsLinkCard, AppExamsInfoCard },

  props: {
    // An array of objects, each representing a quiz the user is enrolled in
    userQuizzes: {
      type: Object as PropType<UserQuiz[]>,
      required: true,
      validator(v: UserQuiz[]) {
        return v.every(
          (quiz) =>
            'description' in quiz &&
            typeof quiz.description === 'string' &&
            'duration' in quiz &&
            typeof quiz.duration === 'number' &&
            'closeTime' in quiz &&
            typeof quiz.closeTime === 'string' &&
            'id' in quiz &&
            typeof quiz.id === 'string' &&
            'name' in quiz &&
            typeof quiz.name === 'string' &&
            'openTime' in quiz &&
            typeof quiz.openTime === 'string' &&
            'quizID' in quiz &&
            typeof quiz.quizID === 'string'
        )
      }
    }
  },

  computed: {
    // Exams that have started, and have not finished
    currentExams() {
      return this.userQuizzes.filter(
        (quiz) =>
          new Date(quiz.openTime) <= new Date() &&
          new Date() < new Date(quiz.closeTime) &&
          !quiz.submitted
      )
    },

    // Exams that have not yet started
    upcomingExams() {
      return this.userQuizzes.filter((quiz) => new Date() < new Date(quiz.openTime))
    },

    // Exams that finished
    pastExams() {
      console.log(this.userQuizzes.filter((quiz) => new Date() >= new Date(quiz.closeTime)))
      return this.userQuizzes.filter((quiz) => { return (new Date() >= new Date(quiz.closeTime) || quiz.submitted)})
    },
    // submitted exams
    // submittedExams() {
    //   return this.userQuizzes.filter(
    //     (quiz) => quiz.submitted !== undefined && quiz.submitted === true
    //   )
    // }
  }
}
</script>
