import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { AddUserMutation } from '../gql/mutations/addUsers'
import { GetUserListQuery } from '../gql/queries/userList'
import { DeleteUserMutation } from '../gql/mutations/deleteUsers'

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

export const deleteUsersMutation = async (
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
