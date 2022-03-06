import "dotenv/config";
import http from "http";

import server from "./server";
import app from "./app";
import { connectDb } from "./models";

async function startApolloServer(port) {
    const httpServer = http.createServer(app);
    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });
    httpServer.listen(port, () => {
        console.log(
            `🚀 Apollo Server running on http://localhost:${port}/graphql`
        );
    });
}

connectDb().then(startApolloServer(3007));
