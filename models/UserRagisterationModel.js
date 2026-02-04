import mongoose from "mongoose";
import Counter from "./Counter.js"; // same counter model reuse

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true }, // 🔹 U-000001 type
  name: { type: String, required: true },

  password: { type: String, default: null }, // optional
  phone: { type: String, required: true, unique: true },

  fcmtoken: { type: String },
  isVerified: { type: Boolean, default: false },

  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },

  registration_date: { type: Date, default: Date.now },
}, { timestamps: true });


// 🔹 Pre-save hook → auto-generate sequential userId
UserSchema.pre("save", async function (next) {
  if (!this.isNew || this.userId) return next();

  try {
    // 1️⃣ Increment counter atomically
    let counter = await Counter.findOneAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // 2️⃣ Fallback check (same as Order)
    const lastUser = await this.constructor
      .findOne({}, {}, { sort: { createdAt: -1 } })
      .lean();

    let lastIdNumber = 0;
    if (lastUser?.userId) {
      const match = lastUser.userId.match(/U-(\d+)/);
      if (match) lastIdNumber = parseInt(match[1], 10);
    }

    if (counter.seq <= lastIdNumber) {
      counter = await Counter.findOneAndUpdate(
        { _id: "userId" },
        { $set: { seq: lastIdNumber + 1 } },
        { new: true, upsert: true }
      );
    }

    // 3️⃣ Final userId
    this.userId = `U-${counter.seq.toString().padStart(6, "0")}`;
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
