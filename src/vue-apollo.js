import Vue from 'vue'
import VueApollo from 'vue-apollo'
import {
    createApolloClient,
    restartWebsockets,
} from 'vue-cli-plugin-apollo/graphql-client'
import { getAuth } from '@firebase/auth'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

// Http endpoint
const httpEndpoint =
    process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:8112/graphql'
// Files URL root
export const filesRoot =
    process.env.VUE_APP_FILES_ROOT ||
    httpEndpoint.substr(0, httpEndpoint.indexOf('/graphql'))

Vue.prototype.$filesRoot = filesRoot

// Config
const defaultOptions = {
    // You can use `https` for secure connection (recommended in production)
    httpEndpoint,
    // You can use `wss` for secure connection (recommended in production)
    // Use `null` to disable subscriptions
    wsEndpoint: null,
    // LocalStorage token
    tokenName: AUTH_TOKEN,
    // Enable Automatic Query persisting with Apollo Engine
    persisting: false,
    // Use websockets for everything (no HTTP)
    // You need to pass a `wsEndpoint` for this to work
    websocketsOnly: false,
    // Is being rendered on the server?
    ssr: false,

    // Override default apollo link
    // note: don't override httpLink here, specify httpLink options in the
    // httpLinkOptions property of defaultOptions.
    // link: myLink

    // Override default cache
    // cache: myCache

    // Override the way the Authorization header is set
    getAuth: async (tokenName) => {
        // Check if auth token in local storage is nearing expiration
        const jwt = localStorage[tokenName]
        const payload = jwt.split('.')[1]
        const exp = JSON.parse(atob(payload)).exp
        const now = new Date().valueOf() / 1000

        if (now + 10 >= exp) {
            // Expired, load the new token into local storage
            // Allows up to 10 second difference between server and client time
            localStorage.setItem(
                tokenName,
                await getAuth().currentUser.getIdToken(true),
            )
        }

        // Return token from local storage
        return localStorage[tokenName]
    },

    // Additional ApolloClient options
    // apollo: { ... }

    // Client local data (see apollo-link-state)
    // clientState: { resolvers: { ... }, defaults: { ... } }
}

// Call this in the Vue app file
export function createProvider(options = {}) {
    // Create apollo client
    const { apolloClient, wsClient } = createApolloClient({
        ...defaultOptions,
        ...options,
    })
    apolloClient.wsClient = wsClient

    // Create vue apollo provider
    const apolloProvider = new VueApollo({
        defaultClient: apolloClient,
        defaultOptions: {
            $query: {
                // fetchPolicy: 'cache-and-network',
            },
        },
        errorHandler(error) {
            // eslint-disable-next-line no-console
            console.log(
                '%cError',
                'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
                error.message,
            )
        },
    })

    return apolloProvider
}

// Manually call this when user log in
export async function onLogin(apolloClient) {
    if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
    try {
        await apolloClient.resetStore()
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(
            '%cError on cache reset (login)',
            'color: orange;',
            e.message,
        )
    }
}

// Manually call this when user log out
export async function onLogout(apolloClient) {
    if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
    try {
        await apolloClient.resetStore()
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(
            '%cError on cache reset (logout)',
            'color: orange;',
            e.message,
        )
    }
}
