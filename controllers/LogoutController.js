import RefreshToken from "../models/RefreshTokenModel.js";

/**
 * POST /api/logout
 * Logout user by deleting refresh token from DB
 */
const logoutUser = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) return res.status(400).json({ message: "Refresh token required" });

        // Delete token from DB
        await RefreshToken.deleteOne({ token });

        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export default logoutUser;
