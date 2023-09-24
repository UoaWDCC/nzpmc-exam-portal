<style scoped lang="scss">
#submit-button {
  width: calc(100% - 15px);
  margin-left: 6px;
  margin-bottom: 1rem;
  color: white;
}
</style>
<template>
  <AppExamTopbarTimer
    v-if="!isAdminAndEditing"
    :duration="duration"
    :quizStart="quizStart"
    :userQuizId="userQuizId"
  />
  <v-list dense nav class="app-exam-sidebar" style="overflow: auto">
    <v-divider
      v-if="!isAdminAndEditing"
      color="white"
      thickness="3"
      class="border-opacity-100 mb-5"
    />
    <v-list-item-group v-model="selected" color="primary">
      <AppExamSidebarLink
        v-for="(question, index) in questions"
        :id="question.id"
        :key="index"
        :number="index + 1"
        :answered="question.userAnswer !== null"
        :flagged="question.flag"
      />
    </v-list-item-group>
  </v-list>
  <v-btn
    color="secondary"
    :disabled="examStore.submitting"
    v-if="!isAdminAndEditing"
    v-on:click="submitQuiz()"
    variant="flat"
    id="submit-button"
    >Submit</v-btn
  >
  <v-btn
    color="secondary"
    :disabled="examStore.submitting"
    v-if="isAdminAndEditing"
    v-on:click=""
    variant="flat"
    id="submit-button"
    >Add New Question</v-btn
  >
  <v-btn
    color="secondary"
    :disabled="examStore.submitting"
    v-if="isAdminAndEditing"
    v-on:click=""
    variant="flat"
    id="submit-button"
    >Exit Editor</v-btn
  >
</template>

<script lang="ts">
import AppExamTopbarTimer from './TopbarTimer.vue'
import AppExamSidebarLink from './SidebarLink.vue'
import { SubmitUserQuizQuestionsMutation } from '@/gql/mutations/userQuiz'
import type { UserQuizQuestion } from '@nzpmc-exam-portal/common'
import type { PropType } from 'vue'
import { useExamStore } from './examStore'
import { mapWritableState } from 'pinia'
import { useMainStore } from '@/stores/main'
import quizEditingMixin from '@/utils/quizEditingMixin'
const SIDEBAR_WIDTH = 56
export default {
  name: 'AppExamSidebar',
  mixins: [quizEditingMixin],

  components: { AppExamSidebarLink, AppExamTopbarTimer },

  props: {
    questions: {
      type: Object as PropType<UserQuizQuestion[]>,
      required: true,
      validator(v: UserQuizQuestion[]) {
        return v.every(
          (question) =>
            'id' in question &&
            typeof question.id === 'string' &&
            'flag' in question &&
            typeof question.flag === 'boolean' &&
            'userAnswer' in question
        )
      }
    },
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
  methods: {
    submitQuiz() {
      console.log('clicek')
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
          this.examStore.submitting = false
        })
        .catch(() => {
          this.snackbarQueue.push(`Unable to submit exam. Please try again later.`)
        })
    }
  },

  data() {
    return {
      SIDEBAR_WIDTH,
      examStore: useExamStore(),
      selected: 0
    }
  },
  computed: {
    ...mapWritableState(useMainStore, ['snackbarQueue'])
  },

  watch: {
    // If no question is selected, go to the first one
    selected: {
      handler(v) {
        if (v === undefined && this.questions[0])
          this.$router.push({
            name: 'AppExamQuestion',
            params: {
              quizID: this.$route.params.quizID,
              questionID: this.questions[0]?.id
            }
          })
      }
    }
  }
}
</script>
