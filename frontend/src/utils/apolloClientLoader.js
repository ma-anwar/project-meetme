import {
  split,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { API, WS } from './constants';
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
  uri: `${API}/graphql`,
  credentials: 'include',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },

  wsLink,

  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

export default client;
