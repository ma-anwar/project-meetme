import { Schema, model } from "mongoose";
import { isAfter, isBefore } from "date-fns";
import { timeslotSchema } from "./timeslot";

const eventSchema = Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        location: {
            type: String,
            required: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        timeslotLength: Number,
        timeslots: [timeslotSchema],
        invitees: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        limited: {
            type: Boolean,
            default: false,
        },
    },
    { timestamp: true }
);

eventSchema.methods.fitsInEvent = async function (datetime) {
    console.log(isBefore(datetime, this.endDate));
    return (
        isAfter(datetime, this.startDate) && isBefore(datetime, this.endDate)
    );
};

const Event = model("Event", eventSchema);
export default Event;
