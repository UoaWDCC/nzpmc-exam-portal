import { GetQuizInfoQuery } from '@/gql/queries/quiz'
import { UserQuizQuery } from '@/gql/queries/userQuiz'
import { useMainStore } from '@/stores/main'
import { useRoute } from 'vue-router'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { EditQuestionMutation } from '@/gql/mutations/quizQuestion'

export default {
  computed: {
    route() {
      return useRoute()
    },
    isAdminAndEditing() {
      return (
        this.route !== undefined && useMainStore().userIsAdmin && this.route.query.edit === 'true'
      )
    },
    isEditingQuizQuery() {
      return { edit: this.isAdminAndEditing ? 'true' : undefined }
    },
    queryType() {
      return this.isAdminAndEditing ? GetQuizInfoQuery : UserQuizQuery
    },
    quizID() {
      return this.route.params.quizID
    },
    questionID() {
      return this.route.params.questionID
    }
  },
  methods: {
    async editQuestionInfo(
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
            input: {
              id: questionID,
              quizID,
              topics,
              imageURI,
              question: questionDescription
            }
          }
        })
        if (mutation.data) {
          console.log(mutation.data)
          return true
        } else return false
      } catch (e) {
        console.error(e)
        return false
      }
    }
  }
}
