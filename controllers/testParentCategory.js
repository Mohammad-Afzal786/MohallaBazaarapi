import mongoose from "mongoose";
import ParentCategory from "../models/parentCategorySchema.js";

mongoose.connect("mongodb://localhost:3000/mohallabazaar")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

const test = async () => {
  const pc = new ParentCategory({
    parentCategoryName: "Electronics",
    parentCategoryImage: "https://example.com/electronics.png"
  });
  console.log("Before save:", pc.parentCategoryId);
  await pc.save();
  console.log("After save:", pc.parentCategoryId);
  process.exit();
};

test();
