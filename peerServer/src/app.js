const express = require("express");
const session = require("express-session");
const connectRedis = require("connect-redis");
const { redisClient } = require("./redisLoader");
const { isAuthenticated } = require("./isAuthenticated");

const app = express();

const RedisStore = connectRedis(session);

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: "MY_SECRET",
        resave: false,
        saveUninitialized: true,
        cookie: {
            sameSite: true,
        },
    })
);

app.use(express.json());

app.use("/", isAuthenticated);

exports.app = app;
