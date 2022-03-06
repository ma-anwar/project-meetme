import express from "express";
import authRouter from "./routes/authRoutes";

const app = express();

app.use(express.json());

app.use("/", authRouter);

export default app;
