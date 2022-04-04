const { ExpressPeerServer } = require("peer");
const http = require("http");
const cors = require("cors");
const { app } = require("./app");

async function startServer(port) {
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
