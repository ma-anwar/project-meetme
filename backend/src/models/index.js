import "dotenv/config";
import mongoose from "mongoose";

import User from "./user";

const connectDb = () =>
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
    });
const models = { User };

export { connectDb };

export default models;
