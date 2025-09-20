import User from "../models/UserRagisterationModel.js";

/**
 * @desc   Check if a user exists by email
 * @route  POST /api/auth/forgot-password
 * @access Public
 */

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        error: "Valid email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      data: {
        message: "User exists with this email",
        userId: user._id, // optional (remove if sensitive)
      },
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err.stack || err.message || err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export default forgotPassword;
