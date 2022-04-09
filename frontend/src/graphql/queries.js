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
      ownerId {
        email
        _id
      }
    }
  }
`;

const GET_EVENTS = gql`
  query eventsOwned($email: String!, $page: Int) {
    eventsOwned(email: $email, page: $page) {
      events {
        title
        description
        startDate
        endDate
        _id
      }
      hasMore
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
      comment
      bookerId {
        _id
        username
      }
      peerId
      peerCallEnded
    }
  }
`;

const GET_TIMESLOTS_IN_RANGE = gql`
  query getSlotsBetween($input: getSlotsInput!) {
    getSlotsBetween(input: $input) {
      _id
      start
      end
      title
      comment
      bookerId {
        _id
        username
      }
      peerId
      peerCallEnded
    }
  }
`;

export { GET_ME, GET_EVENT, GET_EVENTS, GET_TIMESLOT, GET_TIMESLOTS_IN_RANGE };
