import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { notificationSchema } from "./notification";

import { SALT_ROUNDS, EVENT_LIMIT } from "../utils/constants";

const userSchema = Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    validated: {
        type: Boolean,
        default: false,
    },
    eventsOwned: [{ type: Schema.ObjectId, ref: "Event" }],
    eventsParticipating: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    notifications: [notificationSchema],
});

userSchema.statics.hashPass = async function (plainPass) {
    const hashedPass = await bcrypt.hash(plainPass, SALT_ROUNDS);
    return hashedPass;
};

userSchema.statics.isInUse = async function (email) {
    return this.countDocuments({ email }).limit(1);
};

userSchema.methods.hasCorrectPass = async function (password) {
    const isCorrectPass = await bcrypt.compare(password, this.password);
    return isCorrectPass;
};

userSchema.methods.exceedsEventLimit = async function () {
    return this.eventsOwned.length > EVENT_LIMIT;
};

const User = model("User", userSchema);

export default User;
