// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    companyName:{
        type: String,
        required: true,
    },
    phno:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    otp: String,
    otpExpiry: Date,
    
    resetPasswordOtp: String,
    resetPasswordOtpExpiry: Date,

}, { timestamps: true });

export default mongoose.model("User", userSchema);