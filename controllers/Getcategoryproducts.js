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

    // Check if category exists and active
    const category = await Category.findOne({ categoryId, isActive: true }).lean();

    if (!category) {
      return res.status(404).json({
        status: "error",
        success: false,
        message: "Category not found or inactive",
        data: [],
      });
    }

    // Fetch products under this category
    const products = await Product.find({ categoryId, isActive: true }).lean();

    const productData = products.map((p) => ({
      productId: p.productId,
      productName: p.productName,
      productimage: p.productimage,
      productquantity: p.productquantity,
      productprice: p.productprice,
      productdiscountPrice: p.productdiscountPrice,
      productsaveAmount: p.productsaveAmount,
      productrating: p.productrating,
      productratag: p.productratag,
      productDescription: p.productDescription,
      productreviews: p.productreviews,
      producttime: p.producttime,
       productsimagedetails: p.productsimagedetails || [p.productimage], // ✅ 
    }));

    return res.status(200).json({
      status: "success",
      success: true,
      message: "Products fetched successfully by categoryId",
      productData:productData
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
