import User from "../models/UserRagisterationModel.js";

/**
 * @route   GET /api/profile
 * @desc    Get logged-in user's profile
 * @access  Private (requires valid Access Token)
 * 
 * 📌 Features:
 * 1. Access token verify होने के बाद middleware (auth.js) req.user.id inject करता है।
 * 2. User को MongoDB से उसके `_id` से find किया जाता है।
 * 3. Password field exclude की जाती है (`.select("-password")`).
 * 4. अगर user नहीं मिलता तो 404 error return होता है।
 * 5. Success case में user की details (id, username, fathername, email, city, registration_date, isVerified) JSON response में मिलती हैं।
 * 
 * 🔐 Example Success Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "id": "64c1234abc...",
 *     "username": "john_doe",
 *     "fathername": "Mr. Doe",
 *     "email": "john@example.com",
 *     "city": "Delhi",
 *     "registration_date": "2025-08-01T10:20:30Z",
 *     "isVerified": true
 *   }
 * }
 * 
 * ❌ Example Error Response:
 * { "message": "User not found" }  // 404
 * { "message": "Server error" }    // 500
 */

const getProfile = async (req, res) => {
    try {
        // req.user.id = auth middleware से आया हुआ userId
        const user = await User.findById(req.user.userId).select("-password"); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            status: "success",
            data: {
                id: user._id,
                username: user.username,
                fathername: user.fathername,
                email: user.email,
                city: user.city,
                registration_date: user.registration_date,
                isVerified: user.isVerified
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export default getProfile;
