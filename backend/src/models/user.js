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

const hashPass = async function (next) {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    next();
};

userSchema.pre("save", hashPass);

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
