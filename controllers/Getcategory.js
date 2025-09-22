import Category from "../models/CategoryModel.js";
import ParentCategory from "../models/parentCategorySchema.js";

const getCategories = async (req, res) => {
  try {
    // ✅ Fetch only active categories
    const categories = await Category.find({ isActive: true });
    const parents = await ParentCategory.find({ isActive: true });

    if (!categories.length) {
      return res.status(200).json({
        success: true,
        message: "No active categories found",
        data: []
      });
    }

    // ✅ Group categories under parent from ParentCategory collection
    const grouped = parents.map(parent => {
      const children = categories
        .filter(cat => cat.parentCategoryName === parent.parentCategoryName)
        .map(cat => ({
          _id: cat._id,
          categoryName: cat.categoryName,
          categoryimage: cat.categoryimage || null,
          categorysubtitle: cat.categorysubtitle || null,
          categoryId: cat.categoryId
        }));

      return {
        parentCategoryName: parent.parentCategoryName,
        parentCategoryId: parent.parentCategoryId,
        parentCategoryImage: parent.parentCategoryImage,
        parentCategorytitle:parent.parentCategorytitle,
        categories: children
      };
    }).filter(group => group.categories.length > 0); // Remove parent with no children

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: grouped
    });

  } catch (err) {
    console.error("Error in getCategories:", err);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch categories, please try again later"
    });
  }
};

export { getCategories };
