// models/Template.js
import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String, // Rich text with variables {{name}}, {{discount}}, {{link}}
        required: true 
    }
}, { timestamps: true });

export default mongoose.model("Template", templateSchema);