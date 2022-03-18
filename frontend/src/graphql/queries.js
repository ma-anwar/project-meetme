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
        _id
      }
    }
  }
`;

const GET_EVENT = gql`
  query event($id: String!) {
    event(id: $id) {
      title
      description
      startDate
      endDate
      timeslotLength
      location
      ownerId {
        email
        _id
      }
      timeslots {
        start
        end
        title
        bookerId {
          _id
        }
      }
    }
  }
`;
export { GET_ME, GET_EVENT };
