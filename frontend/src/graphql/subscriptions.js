import { gql } from '@apollo/client';

export const GET_SLOT_UPDATES = gql`
  subscription ($eventId: ID, $start: String, $end: String) {
    slotUpdated(eventId: $eventId, start: $start, end: $end) {
      type
      slot {
        _id
        start
        end
        peerId
        peerCallEnded
        comment
        title
        bookerId {
          _id
          username
        }
      }
    }
  }
`;
