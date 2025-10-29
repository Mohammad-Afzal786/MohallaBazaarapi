import dotenv from "dotenv";
dotenv.config();
import User from "../models/UserRagisterationModel.js";

const saveFcmToken = async (req, res) => {
  try {
    let { userId, fcmtoken } = req.body;

    userId = userId?.trim();
    fcmtoken = fcmtoken?.trim();

    if (!userId || !fcmtoken) {
      return res.status(400).json({ status: "error" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "error" });
    }

    user.fcmtoken = fcmtoken;
    user.lastFcmUpdate = new Date();
    await user.save();

    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("❌ Error in saveFcmToken:", error);
    return res.status(500).json({ status: "error" });
  }
};

export { saveFcmToken };
