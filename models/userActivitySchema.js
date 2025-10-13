import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  users: [
    {
      userId: { type: String, required: true },
      visits: { type: Number, default: 1 }, // user ki visits count
    },
  ],
}, { timestamps: true });

// 🔹 Log user visit
userActivitySchema.statics.logActivity = async function(userId) {
  const today = new Date().toISOString().split("T")[0];

  let record = await this.findOne({ date: today });

  if (!record) {
    // 1st visit of the day
    return this.create({ date: today, users: [{ userId, visits: 1 }] });
  }

  const userIndex = record.users.findIndex(u => u.userId === userId);

  if (userIndex === -1) {
    record.users.push({ userId, visits: 1 });
  } else {
    record.users[userIndex].visits += 1;
  }

  return record.save();
};



const UserActivity = mongoose.model("UserActivity", userActivitySchema);
export {UserActivity};
