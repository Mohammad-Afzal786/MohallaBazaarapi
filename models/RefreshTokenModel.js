import mongoose from "mongoose";

/**
 * RefreshToken Schema
 * Stores refresh tokens in DB for logout/blacklist
 */
const RefreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true } // Token expiry (e.g. 7 days)
});

export default mongoose.model("RefreshToken", RefreshTokenSchema);
