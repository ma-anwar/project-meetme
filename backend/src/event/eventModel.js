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
        if (!event.ownerId.equals(userId)) {
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

eventSchema.statics.addSlots = async function (eventId, slots) {
    return this.updateOne(
        { _id: eventId },
        { $push: { timeslots: slots } }
    ).catch((err) => {
        console.log(err);
        throw new Error("Failed to add timeslots");
    });
};

eventSchema.statics.deleteSlot = async function (eventId, slotId) {
    return this.findOneAndUpdate(
        {
            _id: eventId,
        },
        {
            $pull: {
                timeslots: { _id: slotId },
            },
        }
    ).catch((err) => {
        console.log(err);
        throw new Error("Unable to delete timeslot");
    });
};
eventSchema.statics.bookSlot = async function (
    eventId,
    slotId,
    user,
    title,
    comment
) {
    return this.findOneAndUpdate(
        { " _id": eventId, "timeslots._id": slotId },
        {
            $set: {
                "timeslots.$.bookerId": user,
                "timeslots.$.title": title,
                "timeslots.$.comment": comment,
            },
        },
        { projection: { "timeslots.$": 1 } }
    )
        .then((event) => event.timeslots[0])
        .catch((err) => {
            console.log(err);
            throw new Error("Event or slot does not exist");
        });
};

eventSchema.statics.getSlot = async function (eventId, slotId) {
    return this.findOne(
        { " _id": eventId, "timeslots._id": slotId },
        { "timeslots.$": 1 }
    )
        .then((event) => event.timeslots[0])
        .catch((err) => {
            console.log(err);
            throw new Error("Timeslot doesn't exist");
        });
};

eventSchema.statics.addPeerId = async function (eventId, slotId, peerId) {
    return this.findOneAndUpdate(
        { " _id": eventId, "timeslots._id": slotId },
        {
            $set: {
                "timeslots.$.peerId": peerId,
            },
        }
    ).catch((err) => {
        console.error(err);
        throw new Error("Could not add peerId");
    });
};

eventSchema.statics.unbookSlot = async function (
    eventId,
    slotId,
    title,
    comment
) {
    return this.findOneAndUpdate(
        { " _id": eventId, "timeslots._id": slotId },
        {
            $set: {
                "timeslots.$.bookerId": null,
                "timeslots.$.title": title,
                "timeslots.$.comment": comment,
            },
        }
    ).catch((err) => {
        console.log(err);
        throw new Error("Unable to unbook slot");
    });
};

const Event = model("Event", eventSchema);
export default Event;
