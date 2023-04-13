import gql from 'graphql-tag'

export const OptionFragment = gql`
    fragment OptionFragment on Option {
        id
        option
        created
        modified
    }
`
