import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { AddUserMutation } from '../gql/mutations/addUsers'
import { GetUserListQuery } from '../gql/queries/userList'
import { DeleteUserMutation } from '../gql/mutations/deleteUsers'
import type { User } from '@/components/app/admin/UserManagement.vue'
import { GetUserWithEmailQuery } from '@/gql/queries/user'
const DEFAULT_PHOTO_URL =
  'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F49917726%2Fretrieving-default-image-all-url-profile-picture-from-facebook-graph-api&psig=AOvVaw1lWm0yfLpY9NU3R3KLDP7M&ust=1686548570967000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCOj_5ZTBuv8CFQAAAAAdAAAAABAE'

export const addUserMutation = async (
  apollo: ApolloClient<NormalizedCacheObject>,
  email: string,
  firstName?: string,
  lastName?: string,
  photoURL?: string,
  yearLevel?: string
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
          yearLevel: yearLevel
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
    // TODO: Implement this function
    // Start with get user from email query
    const query = await apollo.query({
      query: GetUserWithEmailQuery,
      variables: {
        userEmail: email
      }
    })
    const userId = query.data.user.id
    console.log(`id for ${email}: ${userId}`)
    const mutation = await apollo.mutate({
      mutation: DeleteUserMutation,
      variables: {
        deleteUserId: userId
      }
    })
    const deletedId = mutation.data.deleteUser.id
    console.log(deletedId)
    return deletedId === userId
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
    let csvContent = `${headers}\n${userList
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
