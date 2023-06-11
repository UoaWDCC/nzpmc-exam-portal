import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { AddUserMutation } from '../gql/mutations/addUsers'
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
    console.error(e)
    return false
  }
  throw new Error('Not Implemented')
}
export const deleteUsers = () => {
  throw new Error('Not Implemented')
}
export const downloadUsersCsv = () => {
  throw new Error('Not Implemented')
}
