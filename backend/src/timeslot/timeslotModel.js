import { Schema, model } from "mongoose";

export const timeslotSchema = Schema({
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true,
    },
    title: String,
    bookerId: { type: Schema.Types.ObjectId, ref: "User" },
    peerId: String,
    peerCallEnded: {
        type: Boolean,
        default: false,
    },
    comment: String,
    eventId: { type: Schema.Types.ObjectId, ref: "Event", index: true },
});

timeslotSchema.statics.createSlots = function (eventId, slots) {
    const slotsWithEvent = slots.map((slot) => {
        slot.eventId = eventId;
        return slot;
    });
    return this.create(...slotsWithEvent).catch((err) => {
        console.log(err);
        throw new Error("Unable to create timeslots!");
    });
};

timeslotSchema.statics.getSlotsBetween = function (eventId, start, end) {
    return this.find({
        eventId,
        start: { $gte: start },
        end: { $lte: end },
    })
        .exec()
        .catch((err) => {
            console.log(err);
            throw new Error("Error nonexistent event");
        });
};

timeslotSchema.statics.deleteSlot = function (slotId) {
    return this.deleteOne({ _id: slotId }).catch((err) => {
        console.log(err);
        throw new Error("Unable to delete slot");
    });
};

timeslotSchema.statics.bookSlot = function (slotId, user, title, comment) {
    return this.findOneAndUpdate(
        { _id: slotId },
        {
            $set: {
                bookerId: user,
                title,
                comment,
            },
        },
        { new: true }
    ).catch((err) => {
        console.log(err);
        throw new Error("Event or slot does not exist");
    });
};

timeslotSchema.statics.unbookSlot = function (slotId, title, comment) {
    return this.findOneAndUpdate(
        { _id: slotId },
        {
            $set: {
                bookerId: null,
                title: "Empty slot",
                comment: "",
            },
        },
        { new: true }
    ).catch((err) => {
        console.log(err);
        throw new Error("Unable to unbook slot");
    });
};

timeslotSchema.statics.getSlot = function (slotId) {
    return this.findOne({ _id: slotId })
        .exec()
        .catch((err) => {
            console.log(err);
            throw new Error("Timeslot doesn't exist");
        });
};

timeslotSchema.statics.addPeerId = function (slotId, peerId, peerCallEnded) {
    return this.findOneAndUpdate(
        { _id: slotId },
        {
            $set: {
                peerId,
                peerCallEnded,
            },
        },
        { new: true }
    ).catch((err) => {
        console.error(err);
        throw new Error("Could not add peerId");
    });
};

timeslotSchema.statics.getSlots = function (eventId) {
    return this.find({ eventId }).catch((err) => {
        console.log(err);
        throw new Error("Could not retrieve timeslots");
    });
};

const Timeslot = model("Timeslot", timeslotSchema);
export default Timeslot;
