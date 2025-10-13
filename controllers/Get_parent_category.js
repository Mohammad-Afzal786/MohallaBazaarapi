import ParentCategory from "../models/parentCategorySchema.js";

// 🔹 Get all active parent categories (sorted by latest first)
const getAllParentCategories = async (req, res) => {
  try {
    // Fetch only active parent categories, sorted by latest createdAt
    const categories = await ParentCategory.find({ isActive: true })
       // latest first
      .lean();

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No active parent categories found",
        data: [],
      });
    }

    // ✅ Format each category for cleaner frontend data
    const formatted = categories.map((cat) => ({
      parentCategoryId: cat.parentCategoryId,
      parentCategoryName: cat.parentCategoryName,
      parentCategoryImage: cat.parentCategoryImage,
      parentCategorytitle: cat.parentCategorytitle,
      isActive: cat.isActive,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    return res.status(200).json({
      status: "success",
      message: "Active parent categories fetched successfully",
      data: formatted,
    });
  } catch (err) {
    console.error("❌ Error in getAllParentCategories:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching parent categories",
      error: err.message,
    });
  }
};

export { getAllParentCategories };
