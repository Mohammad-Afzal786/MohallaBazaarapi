import { UserActivity } from "../models/userActivitySchema.js";
import User from "../models/UserRagisterationModel.js";

// 🔹 Log when user opens dashboard
const logUserActivity = async (req, res) => {
  try {
    const { userId ,appVersionId, } = req.body; // frontend se userId bhejenge

    if (!userId || !appVersionId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    } 

    // 🔹 Check if user exists in DB
    const userExists = await User.findOne({ userId });
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const updated = await UserActivity.logActivity(userId  , appVersionId );

    return res.status(200).json({
      success: true,
      message: "User activity logged successfully",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error logging activity:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to log activity",
      error: err.message,
    });
  }
};



export { logUserActivity };
