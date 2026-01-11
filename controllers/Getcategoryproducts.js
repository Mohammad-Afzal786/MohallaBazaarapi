import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
 

// GET /api/categoryProducts?categoryId=<id>
export const getCategoryProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      return res.status(400).json({
        status: "error",
        success: false,
        message: "categoryId query parameter is required",
        data: [],
      });
    }

    // 🔹 Category check
    const category = await Category.findOne({
      categoryId,
      isActive: true,
    }).lean();

    if (!category) {
      return res.status(404).json({
        status: "error",
        success: false,
        message: "Category not found or inactive",
        data: [],
      });
    }

    // 🔹 Fetch products
    let products = await Product.find({
      categoryId,
      isActive: true,
    }).lean();

 
    const productData = products
      .map((p) => {
        if (!p.variants || !p.variants.length) return null;

        return {
          productId: p.productId,
          productName: p.productName,
          productimage: p.productimage,

          // ✅ VARIANTS (same as home API)
          variants: p.variants.map((v) => ({
            variantId: v._id,
            productquantity: v.productquantity,
            productprice: v.productprice,
            productdiscountPrice: v.productdiscountPrice,
            productsaveAmount: v.productsaveAmount,
            stock: v.stock,
            isDefault: v.isDefault,
          })),

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

    return res.status(200).json({
      status: "success",
      success: true,
      message: "Products fetched successfully by categoryId",
      productData,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return res.status(500).json({
      status: "error",
      success: false,
      message: "Something went wrong while fetching products",
      data: [],
    });
  }
};
