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

export { CREATE_EVENT };
