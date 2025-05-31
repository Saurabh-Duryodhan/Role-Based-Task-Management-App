import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
    title: string;
    description?: string;
    status: "pending" | "in_progress" | "completed";
    priority: "low" | "medium" | "high";
    dueDate?: Date;
    reminderAt?: Date;
    assignedTo?: mongoose.Types.ObjectId;
    createdBy?: mongoose.Types.ObjectId;
}

const TasksSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    dueDate: { type: Date },
    reminderAt: { type: Date },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
}, { timestamps: true })

export const Tasks = mongoose.model<ITask>("Tasks", TasksSchema) 