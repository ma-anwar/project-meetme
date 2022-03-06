import express from "express";
import { signup, login } from "../controllers/authController";
import validate from "../validators/validate";
import { signupRules, loginRules } from "../validators/authValidator";

const authRouter = express.Router();

authRouter.post("/signup", signupRules(), validate, signup);

authRouter.post("/login", loginRules(), validate, login);

authRouter.post("/signout", (req, res, next) => {
    res.send(200);
});

export default authRouter;
