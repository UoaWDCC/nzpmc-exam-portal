<template>
  <MobilePlaceholder />
  <div class="app-exams background--grey fill-height" style="overflow-y: auto">
    <v-container class="mt-10">
      <div class="my-6">
        <h1 class="heading mb-6 text-uppercase font-weight-bold">My Exams</h1>
        <p class="intro">
          Kia Ora <strong>{{ nameCase(store.user!.displayName) }}</strong
          >, welcome to the <strong>New Zealand Physics and Mathematics Competition!</strong><br />

          This is your chance to prove your skills and knowledge in <strong>Physics</strong> and
          <strong>Mathematics</strong>.<br /><br />

          Below you will find <strong>past exams</strong>,
          <strong>exams available for you to start</strong>, and
          <strong>upcoming exams</strong>.<br />

          If you can't see an exam that you think you should be enrolled in, contact us at
          <strong
            ><a :href="'mailto:' + contactEmail">{{ contactEmail }}</a></strong
          >.
        </p>
      </div>

      <v-scroll-y-reverse-transition>
        <v-alert v-if="error" type="error" class="my-6">
          {{ error }}
        </v-alert>
      </v-scroll-y-reverse-transition>

      <AppExamsList v-if="!loading && userQuizzes" :user-quizzes="userQuizzes" />
      <v-container v-if="loading" class="pa-0">
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          class="mb-3 mx-auto"
          type="list-item-two-line"
        ></v-skeleton-loader>
      </v-container>
    </v-container>
  </div>
</template>
<script lang="ts">
import AppExamsList from './List.vue'
import { UserQuizzesQuery } from '@/gql/queries/userQuiz'
import { useMainStore } from '@/stores/main'
import formattingMixin from '@/utils/formattingMixin'
import { useExamStore } from '../exam/examStore'

export default {
  name: 'AppExams',

  mixins: [formattingMixin],
  metaInfo: {
    title: 'My Exams' as string
  },

  components: { AppExamsList },
  mounted() {
    useExamStore().submitting = false
  },

  data() {
    return {
      store: useMainStore(),
      userQuizzes: null,
      error: '',
      loading: true,
      contactEmail: 'contact@nzpmc.com'
    }
  },
  apollo: {
    userQuizzes: {
      query: UserQuizzesQuery,
      result({ data, error, loading }) {
        this.loading = loading
        if (error) {
          console.log(error.message)
          this.error = error.message
        } else {
          if (data) this.userQuizzes = data.userQuizzes
        }
      },
      fetchPolicy: 'network-only' // this is kinda annoying (it makes loading the slow and realistically we wont be needing this)
    }
  }
}
</script>

<style scoped lang="scss">
.heading {
  font-size: 2.5rem;
  letter-spacing: 0.8rem;
}

.intro {
  font-size: 1.1rem;
}
</style>
