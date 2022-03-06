import models from "../models";

const User = models.user;
const test = new User({
    username: "test",
    email: "anothher",
    password: "test",
});
