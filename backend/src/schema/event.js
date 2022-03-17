import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        event(id: String!): Event!
    }

    extend type Mutation {
        createEvent(input: CreateEventInput): Event
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        location: String!
        ownerId: User!
        startDate: String!
        endDate: String!
        timeslotLength: Int!
        timeslots: [Timeslot]
        invitees: [User]
        limited: Boolean
    }
    input CreateEventInput {
        title: String!
        description: String
        location: String!
        startDate: String!
        endDate: String!
        timeslotLength: Int
    }
`;
