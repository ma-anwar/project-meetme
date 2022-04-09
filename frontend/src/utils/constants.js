const API = process.env.NODE_ENV === 'production' ? '/api' : '';
const WS =
  process.env.NODE_ENV === 'production'
    ? 'wss://manwar.dev:443/api/graphql'
    : 'ws://localhost:5000/api/graphql';
export { API, WS };
