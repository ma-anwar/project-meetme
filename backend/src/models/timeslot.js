import { Schema, model } from "mongoose";

export const timeslotSchema = Schema({
    datetime: {
        type: Date,
        required: true,
    },
    bookerId: { type: Schema.Types.ObjectId, ref: "User" },
    note: String,
});

const Timeslot = model("Timeslot", timeslotSchema);
export default Timeslot;
