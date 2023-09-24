import { useMainStore } from '@/stores/main'
import { useRoute } from 'vue-router'

export default {
  computed: {
    isAdminAndEdit() {
      return useMainStore().userIsAdmin && useRoute().query.edit === 'true'
    },
    isEditingQuizQuery() {
      return { edit: this.isAdminAndEdit() ? 'true' : undefined }
    }
  }
}
