import User from "../models/UserRagisterationModel.js";
import bcrypt from "bcrypt";

const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword, confirmPassword } = req.body;

    // 1️⃣ Input validation
    if (!userId || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "userId, newPassword, and confirmPassword are required" ,
        data: { message: "userId, newPassword, and confirmPassword are required" }
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match" ,
        data: { message: "Passwords do not match" }
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long" ,
        data: { message: "Password must be at least 6 characters long" }
      });
    }

    // 2️⃣ Find user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
         message: "User not found",
        data: { message: "User not found" }
      });
    }

    // 3️⃣ Hash & save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // 4️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      data: { message: "Password reset successful" }
    });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: { message: "Internal server error" }
    });
  }
};

export default resetPassword;
