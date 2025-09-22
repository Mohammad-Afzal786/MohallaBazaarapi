import Category from "../../models/CategoryModel.js";

import ParentCategory from "../../models/parentCategorySchema.js";
const nameRegex = /^.{2,50}$/;

const createCategory = async (req, res) => {
  try {
    let { parentCategoryName, categoryName, categoryimage, isActive, categorysubtitle } = req.body;

    // Trim inputs
    categoryName = categoryName?.trim();
    categoryimage = categoryimage?.trim();
    categorysubtitle = categorysubtitle?.trim();
    parentCategoryName = parentCategoryName?.trim();

    // 1️⃣ Required validation
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    if (!parentCategoryName) {
      return res.status(400).json({ message: "Parent category name is required" });
    }

    // 2️⃣ Length validation
    if (!nameRegex.test(categoryName)) {
      return res.status(400).json({ message: "Category name must be between 2 and 50 characters" });
    }

    // 3️⃣ Duplicate category check
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }

    // 4️⃣ Check parent category exists
    const parent = await ParentCategory.findOne({ parentCategoryName });
    if (!parent) {
      return res.status(404).json({ message: `Parent category '${parentCategoryName}' not found` });
    }

    // 5️⃣ Save category with parent details
    const savedCategory = await new Category({
      parentCategoryName: parent.parentCategoryName,
      parentCategoryId: parent.parentCategoryId,
      parentCategoryImage: parent.parentCategoryImage,
      categoryName,
      categorysubtitle,
      categoryimage: categoryimage,
      isActive: isActive !== undefined ? isActive : true
    }).save();

    return res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: savedCategory
    });

  } catch (err) {
    console.error("Error in createCategory:", err);
    return res.status(500).json({ message: "Something went wrong, please try again later." });
  }
};

export { createCategory };
