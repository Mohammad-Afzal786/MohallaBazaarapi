import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

// GET /api/getproducts?categoryId=<id>
export const getProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;

    // 1️⃣ categoryId required check
    if (!categoryId) {
      return res.status(400).json({
        status: "error",
        success: false,
        message: "categoryId query parameter is required",
        data: [],
      });
    }

    // 2️⃣ Check if Category exists and active
    const category = await Category.findOne({
      _id: categoryId, // UUID string
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

    // 3️⃣ Fetch all active products for this category
    const products = await Product.find({
      isActive: true,
      categoryId: category._id, // match UUID string
    }).lean();

    // 4️⃣ Group products by subCategoryId (handle optional subCategoryId)
    const subMap = {};

    products.forEach((p) => {
      const subId = p.subCategoryName || "nosub";

      if (!subMap[subId]) {
        subMap[subId] = {
          id: subId,
          name: p.subCategoryName || "Unknown SubCategory",
          image: p.subCategoryImage || "",
          products: [],
        };
      }

      subMap[subId].products.push({
        id: p._id,
        image: p.image,
        productName: p.productName,
        quantity: p.quantity,
        price: p.price,
        discountPrice: p.discountPrice,
        saveAmount: p.saveAmount,
        rating: p.rating,
        reviews: p.reviews,
        time: p.time,
      });
    });

    // 5️⃣ Build final response
    return res.status(200).json({
      status: "success",
      success: true,
      message: "Category wise products fetched successfully",
      data: [
        {
          categoryId: category._id,
          categoryName: category.categoryName,
          image: category.image || "",
          subcategories: Object.values(subMap),
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      status: "error",
      success: false,
      message: "Something went wrong while fetching category products",
      data: [],
    });
  }
};
