import "dotenv/config";
import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";

import schema from "./schema";
import resolvers from "./resolvers";
import models, { connectDb } from "./models";

async function startApolloServer(typedefs, queryResolvers, port) {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        introspection: true,
        typeDefs: schema,
        resolvers: queryResolvers,
        context: async () => ({ models }),
    });
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
    httpServer.listen(port, () => {
        console.log(
            `🚀 Apollo Server running on http://localhost:${port}/graphql`
        );
    });
}

connectDb().then(startApolloServer(schema, resolvers, 3000));
