import UserNotification from "../models/notification.js";

const deleteNotificationByid = async (req, res) => {
  try {
    const { userId, notificationId } = req.query;

    if (!userId || !notificationId) {
      return res.status(400).json({
        status: "error",
        message: "User ID and Notification ID are required",
      });
    }

    const userNotifications = await UserNotification.findOne({ userId });

    if (!userNotifications) {
      return res.status(404).json({
        status: "error",
        message: "User notifications not found",
      });
    }

    const initialLength = userNotifications.notifications.length;

    // Remove the notification
    userNotifications.notifications = userNotifications.notifications.filter(
      (n) => n._id.toString() !== notificationId
    );

    if (userNotifications.notifications.length === initialLength) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    await userNotifications.save();

    return res.status(200).json({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

export { deleteNotificationByid};
