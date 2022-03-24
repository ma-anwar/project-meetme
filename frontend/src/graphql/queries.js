import { gql } from '@apollo/client';

const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
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
        _id
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

const GET_EVENTS = gql`
  query me {
    me {
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

export { GET_ME, GET_EVENT, GET_EVENTS };
