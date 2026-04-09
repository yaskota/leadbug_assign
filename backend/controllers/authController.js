// controllers/authController.js
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOTP } from "../utils/generateOtp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const register = async (req, res) => {
    try {
        const { name, email, companyName, phno, password } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();

        user = new User({ 
            name, 
            email, 
            companyName, 
            phno, 
            password: hashedPassword,
            otp,
            otpExpiry: Date.now() + 10 * 60 * 1000 // 10 minutes
        });

        await user.save();

        // Send OTP email
        await sendEmail({
            to: email,
            subject: "Verify Your Account (OTP)",
            text: `Your account verification OTP is: ${otp}`,
            html: `<p>Your account verification OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`
        });

        res.json({ message: "Registration successful. Please check your email for the OTP." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ message: "Account verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "User not verified" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.cookie("token", token, {    
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",      
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        // Omit password from response
        const userPayload = user.toObject();
        delete userPayload.password;
        delete userPayload.resetPasswordOtp;
        delete userPayload.verificationToken;

        res.json({
            message: "Login successful",
            user: userPayload,
            token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        const otp = generateOTP();
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();

        await sendEmail({
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}`
        });

        res.json({ message: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetPasswordOtp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        if (user.resetPasswordOtpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpiry = undefined;

        await user.save();
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};