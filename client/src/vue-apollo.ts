import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'
import { auth } from '@/firebase'

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

// Http endpoint
const httpEndpoint = import.meta.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql'

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
  getAuth: async (tokenName: any) => {
    // Check if auth token in local storage is nearing expiration
    const jwt = localStorage[tokenName]
    const payload = jwt.split('.')[1]
    const exp = JSON.parse(Buffer.from(payload, 'base64').toString('ascii')).exp
    const now = new Date().valueOf() / 1000

    if (now + 10 >= exp) {
      // Expired, load the new token into local storage
      // Allows up to 10 second difference between server and client time
      localStorage.setItem(tokenName, await auth.currentUser!.getIdToken(true))
    }

    // Return token from local storage
    return localStorage[tokenName]
  }

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
}
// adapted from https://stackoverflow.com/questions/72250439/how-to-set-authentications-headers-with-vue-apollo-and-composition-api
function getHeaders() {
  const headers: { Authorization?: string; 'Content-Type'?: string } = {}
  const token = localStorage.getItem(AUTH_TOKEN)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  headers['Content-Type'] = 'application/json'
  return headers
}

// Call this in the Vue app file
export function createProvider() {
  const cache = new InMemoryCache()

  // HTTP connection to the API
  const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: httpEndpoint,
    fetch: (uri: RequestInfo, options: RequestInit) => {
      options.headers = getHeaders()
      return fetch(uri, options)
    }
  })

  // Create apollo client
  const client = new ApolloClient({
    link: httpLink,
    // ...defaultOptions,
    // ...options,
    cache
  })

  // apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = createApolloProvider({
    defaultClient: client,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      }
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log(
        '%cError',
        'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
        error.message
      )
    }
  })

  return apolloProvider
}

// Manually call this when user log in
export async function onLogin(apolloClient: any, token: string) {
  if (typeof localStorage !== 'undefined' && token) localStorage.setItem(AUTH_TOKEN, token)

  try {
    await apolloClient.resetStore()
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

// Manually call this when user log out
export async function onLogout(apolloClient: any) {
  if (typeof localStorage !== 'undefined') localStorage.removeItem(AUTH_TOKEN)

  try {
    await apolloClient.resetStore()
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}
