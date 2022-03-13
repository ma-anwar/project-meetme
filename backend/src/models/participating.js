import { Schema, model } from "mongoose";

const participatingSchema = Schema(
    {
        event: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        count: {
            type: Number,
            required: true,
        },
    },
    { timestamp: true }
);

const participating = model("Participating", participatingSchema);

export default participating;
