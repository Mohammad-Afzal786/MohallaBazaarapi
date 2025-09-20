import express from "express";
import { createCategory } from "../controllers/admin/CategoryController.js";

import { createProduct } from "../controllers/admin/createproductController.js";
const adminroute = express.Router();
/**
 * ================================
 * Routes
 * ================================
 */
adminroute.post("/create_category",createCategory);
adminroute.post("/create_products",createProduct);
export default adminroute;
