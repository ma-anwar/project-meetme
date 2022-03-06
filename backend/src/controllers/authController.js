import httpStatus from "http-status";
import asyncWrap from "../utils/asyncWrap";

import User from "../models/user";

const signup = asyncWrap(async (req, res) => {
    const { username, email, password } = req.body;

    const userAlreadyExists = await User.isInUse(email);

    if (userAlreadyExists)
        return res.status(httpStatus.BAD_REQUEST).send("User already exists");

    User.create({ username, email, password });

    return res.sendStatus(httpStatus.CREATED);
});

const login = asyncWrap(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const passIsCorrect = await user?.hasCorrectPass(password);

    if (!passIsCorrect)
        return res
            .status(httpStatus.FORBIDDEN)
            .send("Invalid email or password");

    return res.sendStatus(httpStatus.OK);
});

export { signup, login };
