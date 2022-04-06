import { Schema, model } from "mongoose";
import { isAfter, isBefore } from "date-fns";
import { timeslotSchema } from "../timeslot/timeslotModel";

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

eventSchema.statics.throwIfNotEvent = async function (eventId) {
    return this.findOne({ _id: eventId }).catch((err) => {
        console.log(err);
        throw new Error("Event does not exist");
    });
};

eventSchema.statics.throwIfNotOwner = async function (eventId, userId) {
    return this.findOne({ _id: eventId }).then((event) => {
        if (!event.ownerId._id.equals(userId)) {
            throw new Error("Required to be an event owner for this operation");
        }
    });
};

eventSchema.statics.throwIfOwner = async function (eventId, userId) {
    return this.findOne({ _id: eventId }).then((event) => {
        if (event.ownerId.equals(userId)) {
            throw new Error("Event owners not authorized for this operation");
        }
    });
};

const Event = model("Event", eventSchema);
export default Event;
