import { GetQuizInfoQuery } from '@/gql/queries/quiz'
import { UserQuizQuery } from '@/gql/queries/userQuiz'
import { useMainStore } from '@/stores/main'
import { useRoute } from 'vue-router'

export default {
  computed: {
    isAdminAndEdit() {
      return useMainStore().userIsAdmin && useRoute().query.edit === 'true'
    },
    isEditingQuizQuery() {
      return { edit: this.isAdminAndEdit ? 'true' : undefined }
    },
    queryType() {
      return this.isAdminAndEdit ? GetQuizInfoQuery : UserQuizQuery
    }
  }
}
