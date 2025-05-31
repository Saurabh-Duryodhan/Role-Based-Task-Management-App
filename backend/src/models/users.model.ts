import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    email: string,
    phone: number,
    role: "admin" | "manager" | "user"
    password: string,
    refreshToken: string | null
}

const UsersSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },
    role: { type: String, enum: ["admin", "manager", "user"], default: "user" },
    password: { type: String },
    refreshToken: { type: String, default: null }
}, { timestamps: true })

export const Users = mongoose.model<IUser>("Users", UsersSchema)