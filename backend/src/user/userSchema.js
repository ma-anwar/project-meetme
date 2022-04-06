import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        me: User!
        user(email: String!): User
        eventsOwned(email: String!, page: Int): eventsOwnedResult!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
    }
    type eventsOwnedResult {
        events: [Event!]
        hasMore: Boolean
    }
`;
