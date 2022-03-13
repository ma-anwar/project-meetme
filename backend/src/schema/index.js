import { gql } from "apollo-server-express";
import userSchema from "./user";
import eventSchema from "./event";
import timeslotSchema from "./timeslot";

// https://www.apollographql.com/blog/backend/schema-design/modularizing-your-graphql-schema-code/

const masterSchema = gql`
    type Query {
        _: String
    }

    type Mutation {
        _: String
    }
`;

export default [masterSchema, userSchema, eventSchema, timeslotSchema];
