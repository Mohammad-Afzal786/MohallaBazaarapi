import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/UserRagisterationModel.js";
import RefreshToken from "../models/RefreshTokenModel.js";
import dotenv from "dotenv";
dotenv.config();

// --- Configurable constants ---
const MAX_ATTEMPTS = 5;               // Maximum failed login attempts before lock
const BASE_LOCK_TIME = 5 * 60 * 1000; // Base lock time in milliseconds (5 minutes)

/**
 * POST /api/login
 * User Login API
 * 
 * Features:
 * 1. Validates required fields (email & password)
 * 2. Checks if user exists and email is verified
 * 3. Implements failed login attempt tracking
 * 4. Exponential backoff lock on repeated failed attempts
 * 5. Generates Access Token (15 min) and Refresh Token (7 days)
 * 6. Stores Refresh Token safely in DB, removing old tokens
 * 7. Resets failed attempts on successful login
 * 8. Clear JSON responses for Flutter / frontend integration
 */

const loginUser = async (req, res) => {
    try {
        const { email, password,fcmtoken } = req.body;

        // 1️⃣ Check required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // 2️⃣ Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid User Please Register" });
        }

       

        // 4️⃣ Check if account is currently locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(403).json({ message: `Account locked. Try again after ${minutesLeft} minutes.` });
        }

        // 5️⃣ Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Increment failed login attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1;

            // Lock account if max attempts exceeded
            if (user.loginAttempts >= MAX_ATTEMPTS) {
                // Exponential backoff lock: lock time doubles with each extra attempt
                const lockTime = BASE_LOCK_TIME * Math.pow(2, user.loginAttempts - MAX_ATTEMPTS);
                user.lockUntil = Date.now() + lockTime;

                await user.save();
                return res.status(403).json({
                    message: `Account locked due to multiple failed attempts. Try again later.`
                });
            }

            // Save updated attempts and respond
            await user.save();
            return res.status(401).json({
                message: `Invalid credentials. ${MAX_ATTEMPTS - user.loginAttempts} attempts left.`
            });
        }

        // 6️⃣ Successful login → reset failed attempts & lock
        user.loginAttempts = 0;
        user.lockUntil = undefined;
         // ✅ 6️⃣ Save or Update FCM Token if provided
        if (fcmtoken) {
            user.fcmtoken = fcmtoken;
           
        }

        await user.save();

        // 7️⃣ Check JWT secrets
        if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
            console.error("JWT secrets missing!");
            return res.status(500).json({ message: "Server configuration error" });
        }

        // 8️⃣ Generate Access and Refresh Tokens
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "60m" }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // 9️⃣ Save refresh token in DB safely
        try {
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            // Remove old refresh tokens for this user
            await RefreshToken.deleteMany({ userId: user._id });

            // Save new refresh token
            await new RefreshToken({ userId: user._id, token: refreshToken, expiresAt }).save();
        } catch (dbErr) {
            console.error("Refresh token save failed:", dbErr);
            return res.status(500).json({ message: "Login failed (DB error)" });
        }

        // 🔟 Send successful login response
        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            userid: user._id,
            user: { id: user._id, firstName: user.firstName, lastName:user.lastName,email: user.email,phone:user.phone, fcmtoken: user.fcmtoken || null }
        });

    } catch (err) {
        console.error("Error in loginUser:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export default loginUser;
