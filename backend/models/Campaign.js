// models/Campaign.js
import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
        required: true
    },
    recipients: [{
        email: { type: String, required: true },
        name: { type: String },
        status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
        errorMsg: { type: String }
    }],
}, { timestamps: true });

export default mongoose.model("Campaign", campaignSchema);