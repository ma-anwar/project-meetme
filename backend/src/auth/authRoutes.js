import express from "express";
import httpStatus from "http-status";
import { signup, login, signout } from "./authController";
import validate from "../utils/validate";
import { signupRules, loginRules } from "./authValidator";

const authRouter = express.Router();

authRouter.post("/signup", signupRules(), validate, signup);

authRouter.post("/login", loginRules(), validate, login);

authRouter.post("/signout", signout);

authRouter.get("/coffee", (req, res) => {
    res.status(httpStatus.IM_A_TEAPOT).send("No coffee for you");
});

authRouter.get("/tea", (req, res) => {
    res.status(httpStatus.OK).send("Here's the tea");
});

export default authRouter;
