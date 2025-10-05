import mongoose from "mongoose";
const userNotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  notifications: [
    {
      title: { type: String, required: true },
      message: { type: String, required: true },
      image: { type: String }, // <-- Image URL, optional
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});
const UserNotification = mongoose.model("UserNotification", userNotificationSchema);
export default UserNotification;
