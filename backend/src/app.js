import express from "express";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

/* eslint-disable import/first */
import isAuthenticated from "./middleware/isAuthenticated";
import authRouter from "./routes/authRoutes";

const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.json());

app.use("/", authRouter);

app.use("/graphql", isAuthenticated);

export default app;
