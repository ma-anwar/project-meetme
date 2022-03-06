import { gql } from "apollo-server-express";

export default gql`
    type Query {
        me: User!
        user(email: String!): User
    }

    type Mutation {
        signUp(username: String!, email: String!, password: String!): User!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
    }
`;
