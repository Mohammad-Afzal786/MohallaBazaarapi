import User from "../../models/UserRagisterationModel.js";

const userManagement = async (req, res) => {
  try {
    // 🔹 Fetch all users but only selected fields
    const users = await User.find({}, { _id: 0, userId: 1, registration_date: 1, phone: 1, name: 1 }).sort({ registration_date: -1 }).lean();

    res.status(200).json({
      status: "success",
      message: "Total users fetched successfully",
      data: users
    });
  } catch (err) {
    console.error("User management error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
      error: err.message
    });
  }
};

export { userManagement };
