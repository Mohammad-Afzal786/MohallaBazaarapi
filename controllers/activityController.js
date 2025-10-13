import { UserActivity } from "../models/userActivitySchema.js";

// 🔹 Log when user opens dashboard
const logUserActivity = async (req, res) => {
  try {
    const { userId } = req.body; // frontend se userId bhejenge

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const updated = await UserActivity.logActivity(userId);

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
