import express from "express";
import { signup, login, signout } from "../controllers/authController";
import validate from "../validators/validate";
import { signupRules, loginRules } from "../validators/authValidator";

const authRouter = express.Router();

authRouter.post("/signup", signupRules(), validate, signup);

authRouter.post("/login", loginRules(), validate, login);

authRouter.post("/signout", signout);

export default authRouter;
