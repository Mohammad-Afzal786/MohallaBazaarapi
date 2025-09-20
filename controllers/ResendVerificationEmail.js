import dotenv from "dotenv";
dotenv.config();
import User from "../models/UserRagisterationModel.js";
import VerificationToken from "../models/RegistrationVerificationTokenModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

// --- Mail transporter ---
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- Validators ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resendVerificationEmail = async (req, res) => {
    try {
        let { email } = req.body;
        if (!email) return res.status(400).json({ status: "error", message: "Email is required" });
        email = email.trim().toLowerCase();

        if (!emailRegex.test(email)) {
            return res.status(400).json({ status: "error", message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: "error", message: "User not found" });

        if (user.isVerified) {
            return res.status(400).json({ status: "error", message: "Email already verified" });
        }

        // Delete any existing verification tokens
        await VerificationToken.deleteMany({ userId: user._id });

        // Generate new verification token
        const plainToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");

        await new VerificationToken({
            userId: user._id,
            token: hashedToken,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        }).save();

        const verificationLink = `${process.env.BASE_URL}/api/verify/${plainToken}`;

        // Send email
        try {
            await transporter.sendMail({
                from: `"My App" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: `Verify your email, ${user.username}`,
                html: `
                <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px">
                  <div style="max-width:520px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
                    <div style="background:#4CAF50;color:#fff;padding:16px;text-align:center;font-size:18px">Email Verification</div>
                    <div style="padding:20px;color:#333">
                      <p>Hello <b>${user.username}</b>,</p>
                      <p>Here is your new verification link. It expires in 24 hours.</p>
                      <p style="text-align:center;margin:24px 0">
                        <a href="${verificationLink}" style="background:#4CAF50;color:#fff;padding:12px 18px;border-radius:6px;text-decoration:none;display:inline-block">
                          Verify Email
                        </a>
                      </p>
                      <p>If the button doesn’t work, copy this link:</p>
                      <p style="word-break:break-all;color:#555">${verificationLink}</p>
                    </div>
                    <div style="background:#f0f0f0;color:#777;font-size:12px;text-align:center;padding:10px">
                      &copy; ${new Date().getFullYear()} My App. All rights reserved.
                    </div>
                  </div>
                </div>`
            });
        } catch (mailError) {
            console.error("Email sending failed:", mailError);
            return res.status(500).json({
                status: "error",
                message: "Failed to send verification email. Please try again later."
            });
        }

        // Success response
        return res.status(200).json({
            status: "success",
            message: "New verification email sent. Please check your inbox."
        });

    } catch (err) {
        console.error("Error in resendVerificationEmail:", err);
        return res.status(500).json({
            status: "error",
            message: "Something went wrong. Please try again later."
        });
    }
};

export default resendVerificationEmail;
