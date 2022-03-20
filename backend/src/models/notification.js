import { Schema, model } from "mongoose";

export const notificationSchema = Schema(
    {
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Notification = model("Notification", notificationSchema);

export default Notification;
