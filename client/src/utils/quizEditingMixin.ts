import { GetQuizInfoQuery } from '@/gql/queries/quiz'
import { UserQuizQuery } from '@/gql/queries/userQuiz'
import { useMainStore } from '@/stores/main'
import { useRoute } from 'vue-router'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { EditQuestionMutation } from '@/gql/mutations/quizQuestion'

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
  },
  methods: {
    async editQuiz(
      apollo: ApolloClient<NormalizedCacheObject>,
      inputs: {
        questionID: string
        quizID: string
        topics?: string
        imageURI?: string
        questionDescription?: string
      }
    ) {
      const { questionID, quizID, topics, imageURI, questionDescription } = inputs
      try {
        const mutation = await apollo.mutate({
          mutation: EditQuestionMutation,
          variables: {
            id: questionID,
            quizID,
            topics,
            imageURI,
            question: questionDescription
          }
        })
        if (mutation.data) return true
        else return false
      } catch (e) {
        console.error(e)
        return false
      }
    }
  }
}
