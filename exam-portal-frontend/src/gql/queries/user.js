import gql from 'graphql-tag'
import { UserFragment } from '../fragments/user'

export const UsersQuery = gql`
    query UsersQuery(
        $page: Int
        $limit: Int
        $orderBy: UsersOrderByInput
        $term: String
    ) {
        users(page: $page, limit: $limit, orderBy: $orderBy, term: $term) {
            users {
                ...UserFragment
            }
            pages
        }
    }
    ${UserFragment}
`
