import Product from "../../models/ProductModel.js";
import Category from "../../models/CategoryModel.js";
import ParentCategory from "../../models/parentCategorySchema.js";

const nameRegex = /^.{2,1000}$/;

const createProduct = async (req, res) => {
  try {
    const products = Array.isArray(req.body) ? req.body : [req.body];

    if (products.length === 0) {
      return res.status(400).json({ status: "error", message: "Product data required" });
    }

    const createdProducts = [];
    const skippedProducts = [];

    for (let item of products) {
      let {
        categoryName,
        productName,
        productimage,
        productrating,
        productratag,
        productDescription,
        productreviews,
        producttime,
        isActive,
        productsimagedetails,
        variants
      } = item;

      // Trim strings
      categoryName = categoryName?.trim();
      productName = productName?.trim();
      productimage = productimage?.trim();
      productreviews = productreviews?.trim();
      producttime = producttime?.trim();

      if (!categoryName || !productName) {
        skippedProducts.push({ productName, reason: "Missing required fields" });
        continue;
      }

      // Category & parent check
      const category = await Category.findOne({ categoryName, isActive: true });
      if (!category) {
        skippedProducts.push({ productName, reason: "Category not found" });
        continue;
      }
      const parent = await ParentCategory.findOne({
        parentCategoryId: category.parentCategoryId,
        isActive: true
      });
      if (!parent) {
        skippedProducts.push({ productName, reason: "Parent category not found" });
        continue;
      }

      // Duplicate check
      const existing = await Product.findOne({ categoryId: category.categoryId, productName });
      if (existing) {
        skippedProducts.push({ productName, reason: "Already exists" });
        continue;
      }

      // Ensure at least one variant exists
      if (!Array.isArray(variants) || variants.length === 0) {
        skippedProducts.push({ productName, reason: "No variants provided" });
        continue;
      }

      // 🔹 CREATE PRODUCT
      const newProduct = new Product({
        parentCategoryId: parent.parentCategoryId,
        categoryId: category.categoryId,
        productName,
        productimage,
        productsimagedetails: Array.isArray(productsimagedetails) ? productsimagedetails : [],
        productrating: productrating || 0,
        productratag: productratag || 0,
        productDescription: productDescription || "",
        productreviews: productreviews || "0",
        producttime: producttime || "0 mins",
        isActive: isActive !== undefined ? isActive : true,
        variants: variants.map(v => ({
          productquantity: v.productquantity,
          productprice: v.productprice,
          productdiscountPrice: v.productdiscountPrice || 0,
          productsaveAmount: v.productsaveAmount || 0,
          stock: v.stock || 999,
          isDefault: v.isDefault || false
        }))
      });

      await newProduct.save();
      createdProducts.push(newProduct);
    }

    if (createdProducts.length === 0) {
      return res.status(409).json({ status: "error", message: "No product inserted", skippedProducts });
    }

    return res.status(201).json({
      status: "success",
      message: "Bulk product insert completed",
      inserted: createdProducts.length,
      skipped: skippedProducts.length,
      skippedProducts
    });
  } catch (err) {
    console.error("Bulk product error:", err);
    return res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

export { createProduct };
