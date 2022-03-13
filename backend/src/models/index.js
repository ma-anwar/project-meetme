import mongoose from "mongoose";

import User from "./user";
import Event from "./event";
import Notification from "./notification";
import Participating from "./participating";
import Timeslot from "./timeslot";

const connectDb = () =>
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
    });

const models = { User, Event, Notification, Participating, Timeslot };

export { connectDb };

export default models;
