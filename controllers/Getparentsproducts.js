import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import ParentCategory from "../models/parentCategorySchema.js";

// GET /api/getproducts?parentCategoryId=<id>
export const getProducts = async (req, res) => {
  try {
    const { parentCategoryId } = req.query;

    // 1️⃣ parentCategoryId required check
    if (!parentCategoryId) {
      return res.status(400).json({
        status: "error",
        success: false,
        message: "parentCategoryId query parameter is required",
        data: [],
      });
    }

    // 2️⃣ Check if ParentCategory exists and active
    const parent = await ParentCategory.findOne({
      parentCategoryId,
      isActive: true,
    }).lean();

    if (!parent) {
      return res.status(404).json({
        status: "error",
        success: false,
        message: "Parent category not found or inactive",
        data: [],
      });
    }

    // 3️⃣ Fetch all categories under this parent
    const categories = await Category.find({
      parentCategoryId,
      isActive: true,
    }).lean();

    if (!categories.length) {
      return res.status(200).json({
        status: "success",
        success: true,
        message: "No categories found under this parent",
        data: {
          parentCategoryId: parent.parentCategoryId,
          parentCategoryName: parent.parentCategoryName,
          parentCategoryImage: parent.parentCategoryImage || "",
          parentCategorySubtitle: parent.parentCategorySubtitle || "",
          categories: [],
        },
      });
    }

    // 4️⃣ For each category, fetch products
    const categoryData = await Promise.all(
      categories.map(async (cat) => {
        const products = await Product.find({
          isActive: true,
          categoryId: cat.categoryId,
        }).lean();

        return {
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          categoryImage: cat.categoryimage || "",
          categorySubtitle: cat.categorysubtitle || "",
          products: products.map((p) => ({
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
          })),
        };
      })
    );

    // 5️⃣ Final Response
    return res.status(200).json({
      status: "success",
      success: true,
      message: "Products fetched successfully by parentCategoryId",
      data: {
        parentCategoryId: parent.parentCategoryId,
        parentCategoryName: parent.parentCategoryName,
        parentCategoryImage: parent.parentCategoryImage || "",
        parentCategorySubtitle: parent.parentCategorySubtitle || "",
        categories: categoryData,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      status: "error",
      success: false,
      message: "Something went wrong while fetching products",
      data: [],
    });
  }
};
