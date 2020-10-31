import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswapv2'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/index-node/graphql'
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

export function blockClient(uri) {
  return new ApolloClient({
    link: new HttpLink({
      uri
    }),
    cache: new InMemoryCache(),
    shouldBatch: true
  })
}

export function augurV2Client(uri) {
  return new ApolloClient({
    link: new HttpLink({
      uri
    }),
    cache: new InMemoryCache(),
    shouldBatch: true
  })
}
