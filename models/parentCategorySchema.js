import mongoose from "mongoose";
import Counter from "./Counter.js";

const parentCategorySchema = new mongoose.Schema(
  {
    parentCategoryId: {
      type: String,
      unique: true,
      
    },
    parentCategoryName: {
      type: String,
      required: [true, "Parent category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Parent category name must be at least 2 characters"],
      maxlength: [50, "Parent category name must be at most 50 characters"],
    },
    parentCategoryImage: {
      type: String,
      required: [true, "Parent category image is required"],
      trim: true,
    },
    parentCategorytitle: {
      type: String,
      required: [true, "Parent category subtitle is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook → auto generate sequential ID
parentCategorySchema.pre("save", async function (next) {
  if (!this.isNew || this.parentCategoryId) return next();

  try {
    // 1️⃣ Counter increment करो
    let counter = await Counter.findOneAndUpdate(
      { _id: "parentCategoryId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // 2️⃣ DB का last record check करो
    const last = await this.constructor
      .findOne({}, {}, { sort: { createdAt: -1 } })
      .lean();
    let lastIdNumber = 0;

    if (last && last.parentCategoryId) {
      const match = last.parentCategoryId.match(/PC-(\d+)/);
      if (match) lastIdNumber = parseInt(match[1], 10);
    }

    // 3️⃣ अगर counter पीछे है → sync करो
    if (counter.seq <= lastIdNumber) {
      counter = await Counter.findOneAndUpdate(
        { _id: "parentCategoryId" },
        { $set: { seq: lastIdNumber + 1 } },
        { new: true, upsert: true }
      );
    }

    // 4️⃣ Final ID assign
    this.parentCategoryId = `PC-${counter.seq.toString().padStart(4, "0")}`;
    console.log("Generated ID:", this.parentCategoryId);

    return next();
  } catch (err) {
    console.error("ID generation failed:", err);
    return next(err);
  }
});

const ParentCategory = mongoose.model("ParentCategory", parentCategorySchema);
export default ParentCategory;
