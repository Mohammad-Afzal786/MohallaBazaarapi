import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

// Utility: Shuffle array in JS
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// GET /api/homeCategoryProducts
const getHomeCategoryProducts = async (req, res) => {
  try {
    // 🔹 Fetch all active categories (no limit)
    const categories = await Category.find({ isActive: true })
      .sort({ createdAt: -1 }) // latest categories first
      .lean();

    // 🔹 For each category, fetch all active products
    const categoriesWithProducts = await Promise.all(
      categories.map(async (cat) => {
        let products = await Product.find({ categoryId: cat.categoryId, isActive: true })
          .lean();

        // 🔀 Shuffle products for random order
        products = shuffleArray(products);

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
          productsimagedetails: p.productsimagedetails || [p.productimage],
        }));

        return {
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          categoryImage: cat.categoryimage,
          products: productData, // ✅ All products, random order
        };
      })
    );

    return res.status(200).json({
      status: "success",
      success: true,
      message: "Home categories with all products (randomized) fetched successfully",
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

export { getHomeCategoryProducts };
