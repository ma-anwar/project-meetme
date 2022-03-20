import httpStatus from "http-status";
import asyncWrap from "../utils/asyncWrap";

import User from "../models/user";

const getSessionVars = function (user) {
    return { _id: user._id, username: user.username, email: user.email };
};

const signup = asyncWrap(async (req, res) => {
    const { username, email, password } = req.body;

    const userAlreadyExists = await User.isInUse(email);

    if (userAlreadyExists)
        return res.status(httpStatus.BAD_REQUEST).send("User already exists");

    const hashedPass = await User.hashPass(password);
    const newUser = await User.create({
        username,
        email,
        password: hashedPass,
    });

    req.session.user = getSessionVars(newUser);

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

    req.session.user = getSessionVars(user);

    return res.sendStatus(httpStatus.OK);
});

const signout = asyncWrap(async (req, res) => {
    await req.session.destroy();
    return res.sendStatus(httpStatus.OK);
});

export { signup, login, signout };
