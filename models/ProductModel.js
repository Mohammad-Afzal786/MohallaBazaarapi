import mongoose from "mongoose";

// ✅ ProductModel Schema - All mandatory fields
const ProductModel = new mongoose.Schema(
  {
    // Category reference (mandatory)
    categoryId: {
      type: String, // Because Category._id is UUID string
      ref: "Category",
      required: [true, "categoryId is required"],
    },
    categoryName: {
      type: String,
      trim: true,
      required: [true, "categoryName is required"],
    },
    categoryImage: {
      type: String,
      trim: true,
      required: [true, "categoryImage is required"],
    },

    subCategoryName: {
      type: String,
      trim: true,
      required: [true, "subCategoryName is required"],
    },
    subCategoryImage: {
      type: String,
      trim: true,
      required: [true, "subCategoryImage is required"],
    },

    // Product details (mandatory)
    productName: { type: String, required: [true, "productName is required"], trim: true },
    image: { type: String, required: [true, "image is required"], trim: true },
    quantity: { type: String, required: [true, "quantity is required"], trim: true },
    price: { type: Number, required: [true, "price is required"] },
    discountPrice: { type: Number, required: [true, "discountPrice is required"] },
    saveAmount: { type: Number, required: [true, "saveAmount is required"] },
    rating: { type: Number, required: [true, "rating is required"] },
    reviews: { type: String, required: [true, "reviews is required"] },
    time: { type: String, required: [true, "time is required"] },

    // Status
    isActive: { type: Boolean, required: [true, "isActive is required"] },
  },
  { timestamps: true }
);

// ✅ Indexes for faster querying
ProductModel.index({ categoryId: 1 });
ProductModel.index({ isActive: 1 });

// Export model
export default mongoose.model("Product", ProductModel);
