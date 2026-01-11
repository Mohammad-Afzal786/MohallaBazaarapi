// controllers/homeCategoryProducts.js
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

// GET /api/homeCategoryProducts
const getHomeCategoryProducts = async (req, res) => {
  try {
    // 🔹 Fetch active categories
    let categories = await Category.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    // 🔹 Move "Fresh Vegetables" to top
    categories = categories.sort((a, b) => {
      if (a.categoryName === "Fresh Vegetables") return -1;
      if (b.categoryName === "Fresh Vegetables") return 1;
      return 0;
    });

    const categoriesWithProducts = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({
          categoryId: cat.categoryId,
          isActive: true,
        })
          .sort({ createdAt: -1 }) // latest first
          .limit(5)
          .lean();

         
        const productData = products
          .map((p) => {
            if (!p.variants || !p.variants.length) return null;
  
            return {
              productId: p.productId,
              productName: p.productName,
              productimage: p.productimage,

              // ✅ SEND ALL VARIANTS FOR UI
              variants: p.variants.map((v) => ({
                variantId: v._id,
                productquantity: v.productquantity,
                productprice: v.productprice,
                productdiscountPrice: v.productdiscountPrice,
                productsaveAmount: v.productsaveAmount,
                stock: v.stock,
                isDefault: v.isDefault,
              })),

              // 🔹 Other product fields
              productrating: p.productrating,
              productratag: p.productratag,
              productDescription: p.productDescription,
              productreviews: p.productreviews,
              producttime: p.producttime,
              productsimagedetails:
                p.productsimagedetails || [p.productimage],
            };
          })
          .filter(Boolean);

        return {
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          categoryImage: cat.categoryimage,
          products: productData,
        };
      })
    );

    return res.status(200).json({
      status: "success",
      success: true,
      message: "Home categories with multi-variant products fetched successfully",
      data: categoriesWithProducts,
    });
  } catch (error) {
    console.error("Home category error:", error);
    return res.status(500).json({
      status: "error",
      success: false,
      message: "Something went wrong",
      data: [],
    });
  }
};

export { getHomeCategoryProducts };
