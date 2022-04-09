import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        getSlot(input: deleteSlotInput!): Timeslot!
        getSlotsBetween(input: getSlotsInput!): [Timeslot]
    }
    extend type Mutation {
        createSlots(input: createSlotsInput!): [Timeslot]
        bookSlot(input: bookSlotInput!): Timeslot!
        unbookSlot(input: bookSlotInput!): Timeslot!
        deleteSlot(input: deleteSlotInput!): Timeslot!
        addPeerId(input: peerCxnInput!): Timeslot!
    }
    extend type Subscription {
        slotUpdated(eventId: ID, start: String, end: String): slotUpdate
    }

    type Timeslot {
        _id: ID!
        start: String!
        end: String!
        bookerId: Booker
        title: String
        peerId: String
        peerCallEnded: Boolean
        comment: String
    }

    type Booker {
        _id: ID
        username: String
        email: String
    }

    input createSlotInput {
        start: String!
        end: String!
        title: String
    }
    input getSlotsInput {
        eventId: ID!
        start: String!
        end: String!
    }
    input createSlotsInput {
        eventId: ID!
        slots: [createSlotInput]
    }
    input bookSlotInput {
        eventId: ID!
        slotId: ID!
        title: String
        comment: String
    }
    input deleteSlotInput {
        eventId: ID!
        slotId: ID!
    }
    input peerCxnInput {
        eventId: ID!
        slotId: ID!
        peerId: ID
        peerCallEnded: Boolean
    }
    type slotUpdate {
        type: String!
        slot: Timeslot
    }
    type subInput {
        eventId: ID!
        start: String
        end: String
    }
`;
