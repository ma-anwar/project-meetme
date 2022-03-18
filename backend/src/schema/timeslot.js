import { gql } from "apollo-server-express";

export default gql`
    extend type Mutation {
        createSlot(input: createSlotInput): Timeslot
        createSlots(input: createSlotsInput!): [Timeslot]
    }

    type Timeslot {
        _id: ID!
        start: String!
        end: String!
        bookerId: User
        title: String
    }

    input createSlotInput {
        start: String!
        end: String!
        title: String
    }
    input bookSlotInput {
        slotId: ID!
        eventId: ID!
    }
    input createSlotsInput {
        eventId: String
        slots: [createSlotInput]
    }
`;
