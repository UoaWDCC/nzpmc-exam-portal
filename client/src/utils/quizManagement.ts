import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { GetUserQuizzesListQuery } from '../gql/queries/userQuizList'
import type { UserQuiz } from '@/components/app/admin/QuizManagement.vue'
import type { QuizModel } from '@nzpmc-exam-portal/common'
import { GetQuizInfoQuery } from '@/gql/queries/quiz'
import { CreateExamMutation, EditQuizMutation } from '@/gql/mutations/quiz'

export type editQuizInput = {
  description?: string
  duration?: number
  endTime?: Date
  name?: string
  startTime?: Date
}

export const debounce = (fn: any, timeout: number = 300) => {
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timer)
    return new Promise((resolve) => {
      timer = setTimeout(() => {
        resolve(fn.apply(this, args))
      }, timeout)
    })
  }
}

export const createEmptyExamMutation = async (apollo: ApolloClient<NormalizedCacheObject>) => {
  const mutation = await apollo.mutate({
    mutation: CreateExamMutation,
    variables: {
      input: {}
    }
  })
  return mutation.data.addQuiz
}

export const editQuizMutation = async (
  apollo: ApolloClient<NormalizedCacheObject>,
  quizId: string,
  input: editQuizInput
): Promise<QuizModel> => {
  try {
    const { description, duration, endTime, name, startTime } = input
    const mutation = await apollo.mutate({
      mutation: EditQuizMutation,
      variables: {
        input: {
          id: quizId,
          description: description,
          duration: duration,
          endTime: endTime,
          name: name,
          startTime: startTime
        }
      }
    })
    return mutation.data.editQuiz
  } catch (error) {
    return false
  }
}

export const getQuizInfoQuery = async (
  apollo: ApolloClient<NormalizedCacheObject>,
  quizId: string
): Promise<QuizModel> => {
  try {
    const query = await apollo.query({
      query: GetQuizInfoQuery,
      variables: {
        quizId: quizId
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    })
    return query.data.quiz
  } catch (error) {
    return false
  }
}

export const downloadUserQuizzesCsvQuery = async (
  apollo: ApolloClient<NormalizedCacheObject>,
  quizId: string
): Promise<boolean> => {
  try {
    const query = await apollo.query({
      query: GetUserQuizzesListQuery,
      variables: {
        // additional parameters to pass to the query
        quizId: quizId
      }
    })

    const userQuizList: UserQuiz[] = query.data.userQuizzesByQuizID // Assuming the response contains an array of UserQuiz objects
    console.log(userQuizList) // debug print

    // converts from multi-level to single level object
    const userQuizListFormatted = userQuizList.map((userQuiz: UserQuiz) => {
      return {
        id: userQuiz.user.id,
        firstName: userQuiz.user.firstName,
        lastName: userQuiz.user.lastName,
        yearLevel: userQuiz.user.yearLevel,
        score: userQuiz.score
      }
    })

    // Generate column headers from the UserQuiz type properties (thanks Aaron I stole ur code)
    const csvHeaders = Object.keys(userQuizListFormatted[0])
      .filter((key) => key !== '__typename')
      .join(',')
    console.log(csvHeaders)

    // Convert user data to CSV format
    const csvContent = `${csvHeaders}\n${userQuizListFormatted
      .map((currentUserQuiz) => {
        const values = Object.values(currentUserQuiz)
        return values
          .filter((_, index) => Object.keys(currentUserQuiz)[index] !== '__typename')
          .join(',')
      })
      .join('\n')}`
    console.log(csvContent)

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })

    // Create a temporary link element
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'userQuizzes.csv'

    // Programmatically click the link to trigger the download (ty Aaron <3)
    link.click()

    // Clean up the temporary link (ty Aaron)
    URL.revokeObjectURL(link.href)
    link.remove()

    console.log('success?')
    return true
  } catch (error) {
    console.error('Failed to download user quizzes as CSV:', error)
    return false
  }
}
