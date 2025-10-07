import UserNotification from "../models/notification.js";

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    // 🔹 Find user's notifications
    const userNotifications = await UserNotification.findOne(
      { userId },
      { notifications: 1, _id: 0 }
    );

    if (!userNotifications || userNotifications.notifications.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No notifications found",
        notifications: [],
      });
    }

    // 🔹 Sort notifications (latest first)
    const sorted = [...userNotifications.notifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({
      status: "success",
      message: "Notifications fetched successfully",
      notifications: sorted,
    });
  } catch (error) {
    console.error("❌ Error in getNotifications:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

export { getNotifications};
