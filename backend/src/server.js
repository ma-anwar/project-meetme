import { ApolloServer } from "apollo-server-express";

import models from "./models";
import schema from "./schema";
import resolvers from "./resolvers";

const server = new ApolloServer({
    introspection: true,
    typeDefs: schema,
    resolvers,
    context: async ({ req }) => {
        const user = await models.User.findOne({ _id: req.session.user._id });
        return { models, user };
    },
});

export default server;
