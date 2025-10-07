/**
 * @file updateProfile.js
 * @description Controller for updating user profile details (username, fathername, city).
 * 
 * Features:
 * 1. Secured with JWT authentication (middleware required).
 * 2. Allows only limited fields to be updated (no email/password change here).
 * 3. Returns updated profile data (excluding password).
 * 4. Clean JSON response for frontend (Flutter / Web).
 */

import User from "../models/UserRagisterationModel.js";

/**
 * @route   PUT /api/updateProfile
 * @desc    Update user profile details
 * @access  Private (JWT required)
 * 
 * @param   {Object} req - Express request object
 * @param   {Object} req.body - Data sent by client
 * @param   {string} [req.body.username] - New username
 * @param   {string} [req.body.fathername] - New father name
 * @param   {string} [req.body.city] - New city
 * 
 * @param   {Object} res - Express response object
 * 
 * @returns {Object} 200 - Updated user profile
 * @returns {Object} 404 - User not found
 * @returns {Object} 500 - Server error
 * 
 * @example
 * // Request
 * PUT /api/updateProfile
 * Headers: { Authorization: "Bearer <access_token>" }
 * Body:
 * {
 *   "username": "New User",
 *   "fathername": "New Father",
 *   "city": "New City"
 * }
 * 
 * // Success Response
 * {
 *   "status": "success",
 *   "message": "Profile updated successfully",
 *   "data": {
 *     "id": "64f5c8...",
 *     "username": "New User",
 *     "fathername": "New Father",
 *     "email": "user@example.com",
 *     "city": "New City",
 *     "registration_date": "2025-08-16T08:10:20.123Z",
 *     "isVerified": true
 *   }
 * }
 */
const updateProfile = async (req, res) => {
    try {
        const { username, useremail, userphone } = req.body;

        
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2️⃣ Update only allowed fields
        if (username) user.username = username;
        if (fathername) user.fathername = fathername;
        if (city) user.city = city;

        // 3️⃣ Save changes
        await user.save();

        // 4️⃣ Send updated profile back
        res.status(200).json({
            status: "success",
            message: "Profile updated successfully",
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
        console.error("Error in updateProfile:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export default updateProfile;
