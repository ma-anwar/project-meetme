import { gql } from "apollo-server-express";
import userSchema from "../user/userSchema";
import eventSchema from "../event/eventSchema";
import timeslotSchema from "../timeslot/timeslotSchema";

const masterSchema = gql`
    type Query {
        _: String
    }

    type Mutation {
        _: String
    }
`;

export default [masterSchema, userSchema, eventSchema, timeslotSchema];
