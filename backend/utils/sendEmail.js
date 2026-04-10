// utils/sendEmail.js
import { transporter } from "../config/mailer.js";

export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            text,
            html
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
