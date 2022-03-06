import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const saltRounds = 10;

const userSchema = Schema(
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

const hashPass = async function (next) {
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
};

userSchema.pre("save", hashPass);

userSchema.statics.isInUse = async function (email) {
    return this.countDocuments({ email }).limit(1);
};

userSchema.methods.hasCorrectPass = async function (password) {
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const isCorrectPass = await bcrypt.compare(this.password, hashedPass);
    return isCorrectPass;
};

const User = mongoose.model("User", userSchema);

export default User;
