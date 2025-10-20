import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true }, // default true hatao
               
  phone: { type: String, required: true, unique: true },
  fcmtoken: { type: String },
  isVerified: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  registration_date: { type: Date, default: Date.now },
}, { timestamps: true });



const User = mongoose.model("User", UserSchema);
export default User;
