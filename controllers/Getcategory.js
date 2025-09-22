import Category from "../models/CategoryModel.js";

const getCategories = async (req, res) => {
  try {
    // ✅ Fetch only active categories
    const categories = await Category.find({ isActive: true });

    if (!categories.length) {
      return res.status(200).json({
        success: true,
        message: "No active categories found",
        data: []
      });
    }

    // ✅ Group by parent, preserving the order from database
    const grouped = categories.reduce((acc, category) => {
      let parent = acc.find(item => item.parentCategoryName === category.parentCategoryName);

      if (!parent) {
        parent = {
          parentCategoryName: category.parentCategoryName || "Others",
          parentCategoryId: category.parentCategoryId || null,
          parentCategoryImage: category.parentCategoryImage || null,
          categories: []
        };
        acc.push(parent);
      }

      parent.categories.push({
        _id: category._id,
        categoryName: category.categoryName,
        categoryimage: category.categoryimage || null,
        categorysubtitle: category.categorysubtitle || null,
        categoryId: category.categoryId
      });

      return acc;
    }, []);

    // ✅ Success response
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: grouped
    });

  } catch (err) {
    console.error("Error in getCategories:", err);

    // ❌ Fail response
    return res.status(500).json({
      success: false,
      message: "Unable to fetch categories, please try again later"
    });
  }
};

export { getCategories };
