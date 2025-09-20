import Category from "../../models/CategoryModel.js";

// --- Validators ---
const nameRegex = /^.{2,50}$/; // categoryName between 2 to 50 chars

// --- Create Category API ---
const createCategory = async (req, res) => {
  try {
    let { parentcategoryName, categoryName, image, isActive ,categorysubtitle} = req.body;

    // Trim inputs
    parentcategoryName = parentcategoryName?.trim();
    categoryName = categoryName?.trim();
    image = image?.trim();
categorysubtitle = categorysubtitle?.trim();
    // 1️⃣ Required field check
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // 2️⃣ Category name length check
    if (!nameRegex.test(categoryName)) {
      return res.status(400).json({
        message: "Category name must be between 2 and 50 characters"
      });
    }

    // 3️⃣ Duplicate category check
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }

    // 4️⃣ Save category
    const savedCategory = await new Category({
      parentcategoryName: parentcategoryName ,
      categoryName,
      image: image ,
      isActive: isActive !== undefined ? isActive : true
      ,categorysubtitle
    }).save();

    // ✅ Respond to client
   
    return res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: savedCategory
    });
  } catch (err) {
    console.error("Error in createCategory:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again later." });
  }
};

export { createCategory };
