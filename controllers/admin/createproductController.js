import Product from "../../models/ProductModel.js";
import Category from "../../models/CategoryModel.js";
import ParentCategory from "../../models/parentCategorySchema.js";

const nameRegex = /^.{2,100}$/; // productName 2-100 characters

const createProduct = async (req, res) => {
  try {
    let {
      categoryName,
      productName,
      productimage,
      productquantity,
      productprice,
      productdiscountPrice,
      productsaveAmount,
      productrating,
      productratag,
      productDescription,
      productreviews,
      producttime,
      isActive,
    } = req.body;

    // 🔹 Trim strings
    categoryName = categoryName?.trim();
    productName = productName?.trim();
    productimage = productimage?.trim();
    productquantity = productquantity?.trim();
    productreviews = productreviews?.trim();
    producttime = producttime?.trim();

    // 1️⃣ Required validation
    if (!categoryName || !productName || productprice === undefined) {
      return res.status(400).json({
        status: "error",
        message: "categoryName, productName and productprice are required",
      });
    }

    // 2️⃣ Product name validation
    if (!nameRegex.test(productName)) {
      return res.status(400).json({
        status: "error",
        message: "Product name must be 2-100 characters",
      });
    }

    // 3️⃣ Category lookup
    const category = await Category.findOne({ categoryName, isActive: true });
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: `Category '${categoryName}' not found`,
      });
    }

    // 4️⃣ Parent category lookup
    const parent = await ParentCategory.findOne({
      parentCategoryId: category.parentCategoryId,
      isActive: true,
    });
    
    if (!parent) {
      return res.status(404).json({
        status: "error",
        message: `Parent category for '${categoryName}' not found`,
      });
    }

    // 5️⃣ Duplicate check
    const existing = await Product.findOne({
      categoryId: category.categoryId,
      productName,
    });
    if (existing) {
      return res.status(409).json({
        status: "error",
        message: "Product already exists in this category",
      });
    }

    // 6️⃣ Save product with parent + category details
    const newProduct = new Product({
      // 🔹 Parent category details
      parentCategoryId: parent.parentCategoryId,
     

      // 🔹 Category details
      categoryId: category.categoryId,
   
      // 🔹 Product details
      productName,
      productimage,
      productquantity: productquantity || "1 pc",
      productprice,
      productdiscountPrice: productdiscountPrice || 0,
      productsaveAmount: productsaveAmount || 0,
      productrating: productrating || 0,
      productratag: productratag || 0,
      productDescription: productDescription || "",
      productreviews: productreviews || "0",
      producttime: producttime || "0 mins",
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedProduct = await newProduct.save();

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
