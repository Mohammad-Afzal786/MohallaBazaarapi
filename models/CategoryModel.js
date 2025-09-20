import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const categorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4 // custom _id generate automatically
    },
     categorysubtitle: {
      type: String,
      trim: true,
    },
   
     parentcategoryName: {
      type: String,
      trim: true,
  
    },
    category_id: {
      type: String,
      default: uuidv4 // custom _id generate automatically
    },
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"]
    },
    image: {
      type: String, // URL ya file path
      
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

const Category = mongoose.model("categories", categorySchema);

export default Category;
