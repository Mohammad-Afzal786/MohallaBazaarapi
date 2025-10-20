import User from "../models/UserRagisterationModel.js";

const userProfileUpdate = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name,} = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

   
    // 🔹 Find and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    ).select("-__v -password"); // exclude __v and password

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export { userProfileUpdate };
