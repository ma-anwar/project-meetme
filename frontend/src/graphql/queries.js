import { gql } from '@apollo/client';
const GET_ME = gql`
  query me {
    me {
      username
      email
      eventsOwned {
        title
        description
        startDate
        endDate
      }
    }
  }
`;

export { GET_ME };
