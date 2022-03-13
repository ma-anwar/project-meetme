import { gql } from "apollo-server-express";

export default gql`
    extend type Mutation {
        createSlot(eventId: String!, datetime: String!, note: String): Timeslot
    }

    type Timeslot {
        _id: ID!
        datetime: String!
        bookerId: User
        note: String!
    }
`;
