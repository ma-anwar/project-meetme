import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import API from './constants';

const link = createHttpLink({
  uri: `${API}/graphql`,
  credentials: 'include',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
