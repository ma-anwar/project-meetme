/* eslint-disable import/first */
import express from "express";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();
import connectRedis from "connect-redis";
import redisClient from "./utils/redisLoader";
import isAuthenticated from "./middleware/isAuthenticated";
import authRouter from "./routes/authRoutes";

const app = express();

const RedisStore = connectRedis(session);

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.json());

app.use("/", authRouter);

app.use("/graphql", isAuthenticated);

export default app;
