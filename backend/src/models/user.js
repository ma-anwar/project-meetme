import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        toJson: {
            transform(doc, ret) {
                delete ret.password;
                return ret;
            },
        },
    }
);
const User = mongoose.model("User", userSchema);

export default User;
