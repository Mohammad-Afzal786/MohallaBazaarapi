import ProductModel from "../../models/ProductModel.js";

// --- Validator ---
const nameRegex = /^.{2,100}$/; // productName 2-100 characters

// --- Create Product API ---
const createProduct = async (req, res) => {
  try {
    let {
      categoryId,
      categoryName,
      categoryImage,
      subCategoryName,
      subCategoryImage,
      productName,
      image,
      quantity,
      price,
      discountPrice,
      saveAmount,
      rating,
      reviews,
      time,
      isActive
    } = req.body;

    // Trim all string inputs
    categoryName = categoryName?.trim();
    categoryImage = categoryImage?.trim();
    subCategoryName = subCategoryName?.trim();
    subCategoryImage = subCategoryImage?.trim();
    productName = productName?.trim();
    image = image?.trim();
    quantity = quantity?.trim();
    reviews = reviews?.trim();
    time = time?.trim();

    // 1️⃣ Required fields check
    if (!categoryId || !categoryName || !subCategoryName || !productName || price === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Required fields missing",
      });
    }

    // 2️⃣ Product name length check
    if (!nameRegex.test(productName)) {
      return res.status(400).json({
        status: "error",
        message: "Product name must be 2-100 characters",
      });
    }

    // 3️⃣ Duplicate check (same category + subcategory + productName)
    const existing = await ProductModel.findOne({ 
      categoryId, 
      subCategoryName, 
      productName 
    });
    if (existing) {
      return res.status(409).json({
        status: "error",
        message: "Product already exists in this category/sub-category",
      });
    }

    // 4️⃣ Save product
    const newProduct = new ProductModel({
      categoryId,
      categoryName,
      categoryImage,
      subCategoryName,
      subCategoryImage,
      productName,
      image,
      quantity: quantity || "1 pc",
      price,
      discountPrice: discountPrice || 0,
      saveAmount: saveAmount || 0,
      rating: rating || 0,
      reviews: reviews || "0",
      time: time || "0 mins",
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedProduct = await newProduct.save();

    // 5️⃣ Success response
    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: savedProduct,
    });

  } catch (err) {
    console.error("Error in createProduct:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while creating product",
    });
  }
};

export { createProduct };
