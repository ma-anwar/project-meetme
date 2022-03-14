import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './hooks/useAuth';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import reportWebVitals from './reportWebVitals';

const link = createHttpLink({
  uri: 'http://localhost:5000/graphql',
  credentials: 'include',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
