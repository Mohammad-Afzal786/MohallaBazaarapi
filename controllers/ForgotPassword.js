import User from "../models/UserRagisterationModel.js";

/**
 * @desc   Check if a user exists by phone
 * @route  POST /api/auth/forgot-password
 * @access Public
 */
const phoneRegex = /^\d{10,}$/; // कम से कम 10 अंकों का फ़ोन

const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    // फ़ोन नंबर फॉर्मेट चेक
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "फ़ोन नंबर कम से कम 10 अंकों का होना चाहिए।" });
    }

    const normalizedPhone = phone.trim();

    // Find user
    const user = await User.findOne({ phone: normalizedPhone });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "इस नंबर से कोई भी यूज़र अभी तक रजिस्टर्ड नहीं है।",
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      data: {
        message: "इस नंबर से यूज़र मौजूद है।",
        userId: user._id, 
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
