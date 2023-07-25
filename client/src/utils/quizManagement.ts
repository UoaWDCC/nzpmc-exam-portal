import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { GetUserListQuery } from '../gql/queries/userList'
import { GetUserQuizzesListQuery } from '../gql/queries/userQuizList'
import type { User } from '@/components/app/admin/UserManagement.vue'
import type { UserQuiz } from '@/components/app/admin/QuizManagement.vue'

export const downloadUserQuizzesCsvQuery = async (
  apollo: ApolloClient<NormalizedCacheObject>, quizId: string
): Promise<boolean> => {
  try {
    const query = await apollo.query({
      query: GetUserQuizzesListQuery,
      variables: { // additional parameters to pass to the query
        quizId: quizId
      }
    })

    const userQuizList: UserQuiz[] = query.data.userQuizzesByQuizID // Assuming the response contains an array of UserQuiz objects
    console.log(userQuizList) // debug print
    
    // Generate column headers from the UserQuiz type properties (thanks Aaron I stole ur code)
    const csvHeaders = Object.keys(userQuizList[0])
      .filter((key) => key !== '__typename')
      .join(',')
    console.log(csvHeaders)

    // Convert user data to CSV format (thanks again Aaron :) )
    const csvContent = `${csvHeaders}\n${userQuizList
      .map((userQuiz: UserQuiz) => {
        const values = Object.values(userQuiz)
        return values.filter((_, index) => Object.keys(userQuiz)[index] !== '__typename').join(',')
      })
      .join('\n')}`
    console.log(csvContent)
    

  } catch (error) {
    console.error('Failed to download user quizzes as CSV:', error)
    return false
  }

  return true
}


// potential bug where after deletion of a user, it is not updated in the csv download
export const downloadUsersCsvQuery = async (
  apollo: ApolloClient<NormalizedCacheObject>
): Promise<boolean> => {
  try {
    const query = await apollo.query({
      query: GetUserListQuery
      // Add any necessary variables for the query
    })

    const userList: User[] = query.data.users.users // Assuming the response contains an array of user objects
    //console.log(userList) // debug print

    // TODO: Test edge case (no users in the database)

    // Generate column headers from the User type properties
    const headers = Object.keys(userList[0])
      .filter((key) => key !== '__typename')
      .join(',')

    // Convert user data to CSV format
    const csvContent = `${headers}\n${userList
      .map((user: User) => {
        const values = Object.values(user)
        return values.filter((_, index) => Object.keys(user)[index] !== '__typename').join(',')
      })
      .join('\n')}`

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })

    // Create a temporary link element
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'users.csv'

    // Programmatically click the link to trigger the download
    link.click()

    // Clean up the temporary link
    URL.revokeObjectURL(link.href)
    link.remove()
    return true
  } catch (error) {
    console.error('Failed to download users as CSV:', error)
    return false
  }
}
