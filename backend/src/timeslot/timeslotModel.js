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
    comment: String,
});

timeslotSchema.statics.addPeerId = async function (
    eventId,
    slotId,
    peerId,
    eventModel
) {
    await eventModel
        .findOneAndUpdate(
            { " _id": eventId, "timeslots._id": slotId },
            {
                $set: {
                    "timeslots.$.peerId": peerId,
                },
            }
        )
        .catch((err) => {
            console.error(err);
            return null;
        });
    const updatedEvent = await eventModel
        .findOne({ _id: eventId })
        .findOne({ "timeslots._id": slotId }, { "timeslots.$": 1 })
        .catch((err) => {
            console.log(err);
            return null;
        });

    return updatedEvent.timeslots[0];
};

const Timeslot = model("Timeslot", timeslotSchema);
export default Timeslot;
