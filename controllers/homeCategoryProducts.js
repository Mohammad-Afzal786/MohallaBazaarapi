import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

// GET /api/homeCategoryProducts
 const getHomeCategoryProducts = async (req, res) => {
  try {
    // 🔹 Fetch top 10 active categories
    const categories = await Category.find({ isActive: true })
      .sort({ createdAt: -1 }) // latest categories first
      .limit(10)
      .lean();

    // 🔹 For each category, fetch top products
    const categoriesWithProducts = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({ categoryId: cat.categoryId, isActive: true })
          .sort({ soldCount: -1 }) // top-selling products first
          .limit(10)
          .lean();

        const productData = products.map((p) => ({
          productId: p.productId,
          productName: p.productName,
          productimage: p.productimage,
          productquantity: p.productquantity,
          productprice: p.productprice,
          productdiscountPrice: p.productdiscountPrice,
          productsaveAmount: p.productsaveAmount,
          
        }));

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
      message: "Home categories with products fetched successfully",
      data: categoriesWithProducts,
    });
  } catch (error) {
    console.error("Error fetching home categories with products:", error);
    return res.status(500).json({
      status: "error",
      success: false,
      message: "Something went wrong while fetching data",
      data: [],
    });
  }
};
export { getHomeCategoryProducts};
