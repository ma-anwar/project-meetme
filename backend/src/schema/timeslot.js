import { gql } from "apollo-server-express";

export default gql`
    extend type Mutation {
        createSlot(input: createSlotInput): Timeslot
        createSlots(input: createSlotsInput!): [Timeslot]
        bookSlot(input: bookSlotInput!): Timeslot!
        unbookSlot(input: bookSlotInput!): Timeslot!
        deleteSlot(input: deleteSlotInput!): Timeslot!
        startPeerCxn(input: peerCxnInput!): Timeslot!
    }

    type Timeslot {
        _id: ID!
        start: String!
        end: String!
        bookerId: User
        title: String
        peerId: String
    }

    input createSlotInput {
        start: String!
        end: String!
        title: String
    }
    input createSlotsInput {
        eventId: ID!
        slots: [createSlotInput]
    }
    input bookSlotInput {
        eventId: ID!
        slotId: ID!
        title: String
    }
    input deleteSlotInput {
        eventId: ID!
        slotId: ID!
    }
    input peerCxnInput {
        eventId: ID!
        slotId: ID!
        peerId: ID!
    }
`;
