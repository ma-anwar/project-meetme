import { ApolloServer } from "apollo-server-express";

import models from "./models";
import schema from "./schema";
import resolvers from "./resolvers";

const server = new ApolloServer({
    introspection: true,
    typeDefs: schema,
    resolvers,
    context: async ({ req }) => ({ models, user: req.session.user }),
});

export default server;
