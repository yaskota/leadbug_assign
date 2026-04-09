// models/Recipient.js
import mongoose from "mongoose";

const recipientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: String,
    email: String,
}, { timestamps: true });

export default mongoose.model("Recipient", recipientSchema);