import { gql } from "apollo-server-express";

export default gql`
    extend type Mutation {
        createSlot(input: createSlotInput): Timeslot
    }

    type Timeslot {
        _id: ID!
        datetime: String!
        bookerId: User
        note: String!
    }

    input createSlotInput {
        eventId: String!
        datetime: String!
        note: String
    }
`;
