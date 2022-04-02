/* eslint no-console: ["error", { allow: ["warn"] }] */
import http from "http";
import { ExpressPeerServer } from "peer";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import app from "./app";
import server, { schema } from "./server";
import { connectDb } from "./models";

async function startApolloServer(port) {
    const httpServer = http.createServer(app);

    const wsServer = new WebSocketServer({
        server: httpServer,
    });

    const serverCleanup = useServer({ schema }, wsServer);

    /*    const peerServer = ExpressPeerServer(httpServer, {
        debug: true,
        path: "/meetme",
        port,
        proxied: true,
    });
    */

    // app.use("/peerjs", peerServer);

    await server.start();
    server.applyMiddleware({
        app,
        path: "/graphql",
        cors: {
            origin: ["https://studio.apollographql.com"],
            credentials: true,
        },
    });
    httpServer.listen(port, () => {
        console.log(
            `🚀 Apollo Server running on http://localhost:${port}${server.graphqlPath}`
        );
    });
}

const port = process.env.PORT || 5000;

connectDb().then(startApolloServer(port));
