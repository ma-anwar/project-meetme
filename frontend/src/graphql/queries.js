import { gql } from '@apollo/client';
const GET_ME = gql`
  query me {
    me {
      username
      email
    }
  }
`;

export { GET_ME };
