import { GetQuizInfoQuery } from '@/gql/queries/quiz'
import { UserQuizQuery } from '@/gql/queries/userQuiz'
import { useMainStore } from '@/stores/main'
import { watch, computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  computed: {
    isAdminAndEditing() {
      return (
        useRoute() !== undefined && useMainStore().userIsAdmin && useRoute().query.edit === 'true'
      )
    },
    isEditingQuizQuery() {
      return { edit: this.isAdminAndEditing ? 'true' : undefined }
    },
    queryType() {
      return this.isAdminAndEditing ? GetQuizInfoQuery : UserQuizQuery
    }
  }
}
