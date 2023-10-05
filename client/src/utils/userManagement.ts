import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { AddUserMutation } from '../gql/mutations/addUsers'
import { GetUserListQuery } from '../gql/queries/userList'
import { DeleteUserMutation } from '../gql/mutations/deleteUsers'
import { UnenrolUsersFromQuizMutation } from '../gql/mutations/userQuiz'

export const addUserMutation = async (
  apollo: ApolloClient<NormalizedCacheObject>,
  email: string,
  firstName?: string,
  lastName?: string,
  photoURL?: string,
  yearLevel?: string,
  role?: string
): Promise<boolean> => {
  try {
    const mutation = await apollo.mutate({
      mutation: AddUserMutation,
      variables: {
        input: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          photoURL: photoURL,
          yearLevel: yearLevel?.toString(),
          role: role
        }
      }
    })
    console.log(mutation.data)
    return true
  } catch (e) {
    // can catch already used emails
    console.error(e)
    return false
  }
}

export const deleteUserMutation = async (
  apollo: ApolloClient<NormalizedCacheObject>,
  email: string
): Promise<boolean> => {
  try {
    const mutation = await apollo.mutate({
      mutation: DeleteUserMutation,
      variables: {
        deleteUserEmail: email
      }
    })
    const deletedEmail = mutation.data.deleteUser.email
    // delete all associated user quizzes
    console.log('Trying to delete user quizzes')
    const deleteUserQuizzesMutation = await apollo.mutate({
      mutation: UnenrolUsersFromQuizMutation,
      variables: {
        users: [
          {
            id: mutation.data.deleteUser.id
          }
        ],
        quizId: 'all'
      }
    })
    console.log('Deleted user quizzes')
    console.log(deleteUserQuizzesMutation.data)
    return deletedEmail === email.toLowerCase()
  } catch (e) {
    console.error(e)
    return false
  }
}

export const successMessage = (successfulEmails: string[]): string => {
  let res = ''
  successfulEmails.map((email: string) => {
    res += email + ' '
  })
  return `Deleted Successfully: ${res.trim()}`
}

//potential bug where after deletion of a user, it is not updated in the csv download
export const downloadUsersCsvQuery = async (
  apollo: ApolloClient<NormalizedCacheObject>
): Promise<boolean> => {
  try {
    const query = await apollo.query({
      query: GetUserListQuery,
      fetchPolicy: 'network-only'
    })

    const userList: User[] = query.data.users.users // Assuming the response contains an array of user objects
    console.log(userList.length)
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
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().padStart(4, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hour = currentDate.getHours().toString().padStart(2, '0');
    const minute = currentDate.getMinutes().toString().padStart(2, '0');
    const second = currentDate.getSeconds().toString().padStart(2, '0');
    link.download = 'all-students_' + year + '-' + month + '-' + day + '-' + hour + '-' + minute + '-' + second + '.csv'

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
