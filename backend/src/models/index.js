import mongoose from "mongoose";

import User from "../user/userModel";
import Event from "../event/eventModel";
import Notification from "./notification";
import Participating from "./participating";
import Timeslot from "../timeslot/timeslotModel";

const connectDb = () =>
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
    });

const models = { User, Event, Notification, Participating, Timeslot };

export { connectDb };

export default models;
