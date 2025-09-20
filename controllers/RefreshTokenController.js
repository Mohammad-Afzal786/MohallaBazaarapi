import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshTokenModel.js";

/**
 * POST /api/token/refresh
 * Generates new Access Token using Refresh Token
 */
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) return res.status(400).json({ message: "Refresh token required" });

        // 1️⃣ Check if refresh token exists in DB
        const tokenDoc = await RefreshToken.findOne({ token });
        if (!tokenDoc) return res.status(403).json({ message: "Invalid refresh token" });

        // 2️⃣ Verify refresh token
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Expired or invalid refresh token" });

            // 3️⃣ Generate new access token
            const accessToken = jwt.sign(
                { userId: decoded.userId },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );

            res.status(200).json({ accessToken });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export default refreshToken;
