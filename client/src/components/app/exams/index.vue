
<template>
  <div class="app-exams background--grey fill-height" style="overflow-y: auto">
    <v-container class="mt-10">
      <div class="my-6">
        <h1 class="mb-6 text-h4 text-uppercase font-weight-bold">My Exams</h1>
        <p class="text-subtitle-1">
          Kia ora and welcome to the New Zealand Physics and Mathematics Competition.
          This is your chance to prove your skills and knowledge in the Physics and
          Mathematics subjects. You will be tested on your knowledge of the subjects,
          and your ability to solve problems.<br/>Below you can see the exams available for
          you to start, past exams, and ones that you're enrolled in for the future.
          If you can't see an exam that you think you should be enrolled in, contact us
          at <a href="mailto:contact.nzpmc@gmail.com">contact.nzpmc@gmail.com</a>.
        </p>
      </div>

    <v-scroll-y-reverse-transition>
        <v-alert v-if="error" type="error" class="my-6">
          {{ error }}
        </v-alert>
      </v-scroll-y-reverse-transition>

        <AppExamsList v-if="!loading && userQuizzes" :user-quizzes="userQuizzes" />
        <v-skeleton-loader
          v-if="loading"
          v-for="i in 3"
          :key="i"
          class="mb-3 mx-auto"
          type="list-item-two-line"
        ></v-skeleton-loader>
    </v-container>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AppExamsList from './List.vue'
import { UserQuizzesQuery } from '@/gql/queries/userQuiz'

export default defineComponent({
  name: 'AppExams',

  metaInfo: {
    title: 'My Exams' as string,
  },

  components: { AppExamsList },

  data() {
    return {
    	userQuizzes: null,
      error: "",
      loading: true,
	}

  },

  apollo: {
    userQuizzes: {
      query: UserQuizzesQuery,
      result({ data, error, loading }) {
        this.loading = loading
        if (error) {
          this.error = error.message
        } else {
			if (data) this.userQuizzes = data.userQuizzes; 
        }
      },
      fetchPolicy: 'cache-and-network',
    },
  },
})
</script>
