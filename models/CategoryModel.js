import mongoose from "mongoose";

import Counter from "./Counter.js";

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
    
    },
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name must be at most 50 characters"],
    },
    categoryimage: {
      type: String,
      trim: true,
    },
    parentCategoryId: {
      type: String, // parent reference
    },
    parentCategoryName: {
      type: String,
      trim: true,
    },
    parentCategoryImage: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook → auto generate sequential categoryId
categorySchema.pre("save", async function (next) {
  if (!this.isNew || this.categoryId) return next();

  try {
    // 1️⃣ Counter increment (atomic)
    let counter = await Counter.findOneAndUpdate(
      { _id: "categoryId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // 2️⃣ DB last record check (fallback)
    const last = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } }).lean();
    let lastIdNumber = 0;
    if (last && last.categoryId) {
      const match = last.categoryId.match(/C-(\d+)/);
      if (match) lastIdNumber = parseInt(match[1], 10);
    }

    // 3️⃣ Sync counter if behind
    if (counter.seq <= lastIdNumber) {
      counter = await Counter.findOneAndUpdate(
        { _id: "categoryId" },
        { $set: { seq: lastIdNumber + 1 } },
        { new: true, upsert: true }
      );
    }

    // 4️⃣ Assign final ID
    this.categoryId = `C-${counter.seq.toString().padStart(4, "0")}`;
    console.log("Generated categoryId:", this.categoryId);

    return next();
  } catch (err) {
    console.error("Category ID generation failed:", err);
    return next(err);
  }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
