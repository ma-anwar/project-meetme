import { gql } from "apollo-server-express";

export default gql`
    extend type Mutation {
        createSlot(input: createSlotInput): Timeslot
    }

    type Timeslot {
        _id: ID!
        start: String!
        end: String!
        bookerId: User
        title: String!
    }

    input createSlotInput {
        eventId: String!
        start: String!
        end: String!
        title: String
    }
`;
