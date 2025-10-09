import mongoose from "mongoose";
import Counter from "./Counter.js";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String, // auto generated like P-0001
    },

    // 🔹 Parent category reference
    parentCategoryId: {
      type: String,
      trim: true,
    },
   
    // 🔹 Category reference
    categoryId: {
      type: String, // Because Category.categoryId is custom (C-0001)
      ref: "Category",
      required: [true, "categoryId is required"],
    },
    
    // 🔹 Product details
    productName: {
      type: String,
      required: [true, "productName is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [1000, "Product name must be at most 100 characters"],
    },
    productimage: {
      type: String,
      required: [true, "image is required"],
      trim: true,
    },
    productquantity: {
      type: String,
      required: [true, "quantity is required"],
      trim: true,
    },
    productprice: {
      type: Number,
      required: [true, "price is required"],
    },
    productdiscountPrice: {
      type: Number,
  
    },
    productsaveAmount: {
      type: Number,
     required:true
    },
    productrating: {
      type: Number,
     required:true
    },
    productratag: {
      type: Number, 
    },
     productDescription: {
      type: String,
    },
    productreviews: {
      type: String,
      required:true
    },
    productsimagedetails: {
      type: [String], // Array of image URLs
      default: [],
    },
    producttime: {
      type: String,
      required:true
    },

    // 🔹 Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ Pre-save hook → auto generate sequential productId
productSchema.pre("save", async function (next) {
  if (!this.isNew || this.productId) return next();

  try {
    // 1️⃣ Counter increment (atomic)
    let counter = await Counter.findOneAndUpdate(
      { _id: "productId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // 2️⃣ DB last record check (fallback)
    const last = await this.constructor
      .findOne({}, {}, { sort: { createdAt: -1 } })
      .lean();
    let lastIdNumber = 0;
    if (last && last.productId) {
      const match = last.productId.match(/P-(\d+)/);
      if (match) lastIdNumber = parseInt(match[1], 10);
    }

    // 3️⃣ Sync counter if behind
    if (counter.seq <= lastIdNumber) {
      counter = await Counter.findOneAndUpdate(
        { _id: "productId" },
        { $set: { seq: lastIdNumber + 1 } },
        { new: true, upsert: true }
      );
    }

    // 4️⃣ Assign final ID
    this.productId = `P-${counter.seq.toString().padStart(4, "0")}`;
    console.log("Generated productId:", this.productId);

    return next();
  } catch (err) {
    console.error("Product ID generation failed:", err);
    return next(err);
  }
});

// ✅ Indexes
productSchema.index({ categoryId: 1 });
productSchema.index({ parentCategoryId: 1 });
productSchema.index({ isActive: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
