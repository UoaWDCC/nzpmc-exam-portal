import { GetQuizInfoQuery } from '@/gql/queries/quiz'
import { UserQuizQuery } from '@/gql/queries/userQuiz'
import { useMainStore } from '@/stores/main'
import { useRoute } from 'vue-router'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { EditOptionMutation, EditQuestionMutation } from '@/gql/mutations/quizQuestion'

export default {
  computed: {
    route() {
      return useRoute()
    },
    isAdmin() {
      return useMainStore().userIsAdmin
    },
    isEditMode() {
      return this.route.query.edit === 'true'
    },
    isPreviewMode() {
      return this.route.query.preview === 'true'
    },
    isAdminAndEditing() {
      return this.route !== undefined && this.isAdmin && this.isEditMode
    },
    isAdminAndPreviewing() {
      return this.route !== undefined && this.isAdmin && this.isPreviewMode
    },
    isEditingQuizQuery() {
      return { edit: this.isAdminAndEditing ? 'true' : undefined }
    },
    isPreviewingQuery() {
      return { preview: this.isAdminAndPreviewing ? 'true' : undefined }
    },
    isAdminNotSittingExam() {
      return this.isAdminAndPreviewing || this.isAdminAndEditing
    },
    uriQueryType() {
      return { ...this.isEditingQuizQuery, ...this.isPreviewingQuery }
    },
    queryType() {
      return this.isAdminNotSittingExam ? GetQuizInfoQuery : UserQuizQuery
    },
    quizID() {
      return this.route.params.quizID
    },
    questionID() {
      return this.route.params.questionID
    }
  },
  methods: {
    async editQuestionOptionInfo(
      apollo: ApolloClient<NormalizedCacheObject>,
      inputs: {
        id: string
        optionDescription: string
        questionID: string
        quizID: string
      }
    ) {
      const { id, optionDescription, questionID, quizID } = inputs
      try {
        const mutation = await apollo.mutate({
          mutation: EditOptionMutation,
          variables: {
            input: {
              id,
              option: optionDescription,
              questionID,
              quizID
            }
          }
        })
        if (mutation.data) {
          console.log(mutation.data)
        }
        return true
      } catch (e) {
        console.error(e)
        return false
      }
    },
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
