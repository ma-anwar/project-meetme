import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";

import models from "./models";
import schema from "./schema";
import resolvers from "./resolvers";

const server = new ApolloServer({
    introspection: true,
    typeDefs: schema,
    resolvers,
    context: async () => ({ models }),
    plguins: [ApolloServerPluginDrainHttpServer],
});

export default server;
