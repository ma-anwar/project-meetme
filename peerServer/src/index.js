/* eslint no-console: ["error", { allow: ["warn"] }] */
const express = require("express");
const { ExpressPeerServer } = require("peer");
const http = require("http");
const cors = require("cors");

async function startServer(port) {
    const app = express();
    app.use(cors());
    const httpServer = http.createServer(app);

    const peerServer = ExpressPeerServer(httpServer, {
        debug: true,
        path: "/meetme",
        port,
        proxied: true,
    });

    app.use("/peerjs", peerServer);

    httpServer.listen(port, () => {
        console.log(`🚀 Peer Server running on http://localhost:${port}`);
    });
}

const port = process.env.PORT || 4000;

startServer(port);
