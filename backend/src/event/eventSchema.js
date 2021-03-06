import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        event(id: String!): Event!
    }

    extend type Mutation {
        createEvent(input: CreateEventInput): Event
        deleteEvent(input: deleteEventInput): Boolean
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
    input deleteEventInput {
        eventId: ID!
    }
`;
