/* eslint-disable import/first */
import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import connectRedis from "connect-redis";
import redisClient from "./utils/redisLoader";
import isAuthenticated from "./middleware/isAuthenticated";
import authRouter from "./routes/authRoutes";

const environment = process.env.NODE_ENV || "development";

const app = express();

if (environment === "development") {
    app.use(cors());
    app.use("/api/auth", (req, res, next) => {
        console.log(req.body);
        next();
    });
}
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

app.use("/api/auth", authRouter);

app.use("/graphql", isAuthenticated);

export default app;
