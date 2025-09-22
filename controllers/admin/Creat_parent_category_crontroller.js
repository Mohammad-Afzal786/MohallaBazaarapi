import ParentCategory from "../../models/parentCategorySchema.js";

const NAME_REGEX = /^.{2,50}$/;

const createParentCategory = async (req, res) => {
  try {
    const { parentCategoryName, parentCategoryImage, isActive ,parentCategorytitle} = req.body;

    // Validation
    if (!parentCategoryName) {
      return res.status(400).json({ status: "fail", message: "Name required" });
    }
    if (!parentCategoryImage) {
      return res.status(400).json({ status: "fail", message: "Image required" });
    }
if (!parentCategorytitle) {
      return res.status(400).json({ status: "fail", message: "parentCategorytitle required" });
    }
    // Duplicate check
    const exists = await ParentCategory.findOne({ parentCategoryName });
    if (exists) {
      return res.status(409).json({ status: "fail", message: "Already exists" });
    }

    // Create
    const category = new ParentCategory({
      parentCategoryName,
      parentCategoryImage,
      isActive: isActive ?? true,
      parentCategorytitle,
    });

    const saved = await category.save();

    return res.status(201).json({
      status: "success",
      message: "Parent category created",
      data: saved,
    });
  } catch (err) {
    console.error("Error in createParentCategory:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

export { createParentCategory };