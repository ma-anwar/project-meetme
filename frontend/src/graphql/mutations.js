/* pasting type defs here, will figure out how to autogen if I have time, these should be good enough for now
 *
 * May have to send all values to backend for now
    input CreateEventInput {
        title: String!
        description: String
        location: String!
        startDate: String!
        endDate: String!
        timeslotLength: Int
    }
 */
import { gql } from '@apollo/client';
const CREATE_EVENT = gql`
  mutation createEvent($input: CreateEventInput) {
    createEvent(input: $input) {
      _id
      title
      description
      location
      startDate
      endDate
    }
  }
`;

const CREATE_SLOTS = gql`
  mutation createSlots($input: createSlotsInput!) {
    createSlots(input: $input) {
      _id
      start
      end
      title
      bookerId {
        _id
      }
    }
  }
`;

const BOOK_SLOT = gql`
  mutation bookSlot($input: bookSlotInput!) {
    bookSlot(input: $input) {
      _id
    }
  }
`;

const DELETE_SLOT = gql`
  mutation deleteSlot($input: deleteSlotInput!) {
    deleteSlot(input: $input) {
      _id
    }
  }
`;

const UNBOOK_SLOT = gql`
  mutation unbookSlot($input: bookSlotInput!) {
    unbookSlot(input: $input) {
      _id
    }
  }
`;

const DELETE_EVENT = gql`
  mutation deleteEvent($input: deleteEventInput) {
    deleteEvent(input: $input)
  }
`;

const START_PEER_CXN = gql`
  mutation addPeerId($input: peerCxnInput!) {
    addPeerId(input: $input) {
      _id
      peerId
      peerCallEnded
    }
  }
`;

export {
  CREATE_EVENT,
  CREATE_SLOTS,
  BOOK_SLOT,
  DELETE_SLOT,
  DELETE_EVENT,
  UNBOOK_SLOT,
  START_PEER_CXN,
};
