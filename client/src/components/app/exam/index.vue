<template>
  <div class="app-exam">
    <AppSubmittingOverlay />
    <v-scroll-y-reverse-transition>
      <v-alert v-if="error" type="error" class="mx-3 my-6">
        {{ $errorMessage }}
      </v-alert>
    </v-scroll-y-reverse-transition>

    <AppExamTopbarLoader v-if="loading" />

    <AppExamTopbar v-if="data" :name="data.name" />

    <v-container v-if="data || loading" class="exam-and-sidebar-container">
      <v-navigation-drawer class="sidebar-container" permanent clipped left mini-variant>
        <AppExamSidebarLoader v-if="loading" />

        <v-scroll-y-reverse-transition>
          <AppExamSidebar v-if="data" :questions="data.questions" :duration="data.duration" :quizStart="data.quizStart"
            :userQuizId="data.id" />
        </v-scroll-y-reverse-transition>
      </v-navigation-drawer>

      <AppExamQuestionLoader v-if="isLoading" />

      <div v-if="data" class="question-container" style="overflow: hidden">
        <component :is="routeTransition" hide-on-leave>
          <router-view :key="$route.params.questionID" />
        </component>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import { UserQuizQuery } from '@/gql/queries/userQuiz'
import AppExamTopbarLoader from './TopbarLoader.vue'
import AppExamTopbar from './Topbar.vue'
import AppExamSidebarLoader from './SidebarLoader.vue'
import AppExamQuestionLoader from './Question/Loader.vue'
import AppExamSidebar from './Sidebar.vue'
import AppSubmittingOverlay from './SubmittingOverlay.vue'
import { VSlideXTransition, VSlideXReverseTransition } from 'vuetify/components'
import { defineComponent } from 'vue'
import { TOOLBAR_HEIGHT } from '@/helpers'
import type { UserQuizModel } from '@nzpmc-exam-portal/common'
import { watch } from 'vue'

export default defineComponent({
  name: 'AppExam',

  metaInfo() {
    return {
      title: this.name ?? 'Exam'
    }
  },

  components: {
    AppExamTopbarLoader,
    AppExamTopbar,
    AppExamSidebarLoader,
    AppExamQuestionLoader,
    AppSubmittingOverlay,
    AppExamSidebar
  },

  beforeRouteUpdate(to, from, next) {
    this.routeTransition =
      from.params.questionID === undefined
        ? 'Transition'
        : to.params.questionID > from.params.questionID
          ? VSlideXReverseTransition
          : VSlideXTransition
    next()
  },

  data(): {
    data: UserQuizModel | undefined
    loading: boolean
    error: any
    routeTransition: any
    TOOLBAR_HEIGHT: number
  } {
    return {
      TOOLBAR_HEIGHT,
      routeTransition: VSlideXTransition,
      data: undefined,
      loading: false,
      error: null
    }
  },

  apollo: {
    name: {
      query: UserQuizQuery,
      variables() {
        return { quizID: this.$route.params.quizID }
      },

      result({ data, error, loading }) {
        this.loading = loading
        if (error) {
          console.log(this.$route.params.quizID)
          this.error = error.message
        } else {
          if (data) {
            this.data = data.userQuiz
            if (this.data?.submitted) {
              this.$router.push({ name: 'AppExams' })
            }
            console.log(data)
          }
        }
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    }
  },
})
</script>

<style scoped lang="scss">
.app-exam .slide-x-transition-enter {
  opacity: 0;
  transform: translateX(-50vw);
}

.app-exam .slide-x-reverse-transition-enter {
  opacity: 0;
  transform: translateX(50vw);
}

.exam-and-sidebar-container {
  width: 100%;
  margin: 0;
  padding-right: 0;
  padding-bottom: 0;
  max-width: 100vw;

  .question-container {
    padding: 0;
    justify-self: flex-end;
    padding-left: 240px;
  }
}
</style>
