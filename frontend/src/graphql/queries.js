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
      _id
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
        peerId
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

const GET_TIMESLOT = gql`
  query getSlot($input: deleteSlotInput!) {
    getSlot(input: $input) {
      _id
      start
      end
      title
      bookerId {
        _id
      }
      peerId
    }
  }
`;

const GET_TIMESLOTS = gql`
  query event($id: String!) {
    event(id: $id) {
      timeslots {
        _id
        start
        end
        title
        bookerId {
          _id
        }
        peerId
      }
    }
  }
`;

export { GET_ME, GET_EVENT, GET_EVENTS, GET_TIMESLOT, GET_TIMESLOTS };
