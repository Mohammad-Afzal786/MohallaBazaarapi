import admin from "firebase-admin";
import path from "path";
import { readFileSync } from "node:fs";
import UserNotification from "../../models/notification.js";
import User from "../../models/UserRagisterationModel.js";

// ✅ Load Firebase Service Account
const serviceAccountPath = path.resolve("./config/serviceAccountKey.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

// ✅ Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * POST /api/send-notification
 * Automatically sends notification to all users (or those who have valid fcmToken)
 */
const sendNotification = async (req, res) => {
  const { title, body, image } = req.body;

  if (!title || !body) {
    return res.status(400).json({
      status: "error",
      message: "Title and body are required",
    });
  }

  try {
    // 🔹 Fetch all users having FCM token
    const users = await User.find({ fcmtoken: { $exists: true, $ne: "" } });

    if (users.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No users found with FCM token",
      });
    }

    // 🔹 Prepare notifications
    const messages = users.map((user) => ({
      token: user.fcmtoken.trim(),
      notification: { title, body ,image: image || "", },
      data: {
        screen: "dashboard_notifications",
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
    }));

    // 🔹 Send in bulk (firebase supports up to 500 tokens per call)
    const BATCH_SIZE = 500;
    let totalSuccess = 0;
    let totalFailure = 0;

    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      const response = await admin.messaging().sendEach(batch);
       console.log("Responses per token:", response.responses);

      totalSuccess += response.successCount;
      totalFailure += response.failureCount;
    }

    // 🔹 Save notifications in DB per user
    const notificationsToSave = users.map((user) => ({
      updateOne: {
        filter: { userId: user._id },
        update: {
          $push: {
            notifications: {
              title,
              message: body,
              image: image || "",
              createdAt: new Date(),
            },
          },
        },
        upsert: true,
      },
    }));

    await UserNotification.bulkWrite(notificationsToSave);

    return res.status(200).json({
      status: "success",
      message: `Notifications sent successfully to ${totalSuccess} users`,
      failed: totalFailure,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to send notifications",
      error: error.message,
    });
  }
};

export { sendNotification };
