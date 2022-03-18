import { Schema, model } from "mongoose";

export const timeslotSchema = Schema({
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    title: String,
    bookerId: { type: Schema.Types.ObjectId, ref: "User" },
});

const Timeslot = model("Timeslot", timeslotSchema);
export default Timeslot;
