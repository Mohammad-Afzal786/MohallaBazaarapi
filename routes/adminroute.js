import express from "express";
import { createCategory } from "../controllers/admin/createCategoryController.js";

import { createProduct } from "../controllers/admin/createproductController.js";

import { createParentCategory } from "../controllers/admin/Creat_parent_category_crontroller.js";

import { sendNotification } from "../controllers/admin/notification.js";

const adminroute = express.Router();
/**
 * ================================
 * Routes
 * ================================
 */
adminroute.post("/create_category",createCategory);
adminroute.post("/create_products",createProduct);
// Parent Category Routes
adminroute.post("/create_parent_category", createParentCategory);
adminroute.post('/send-notification', sendNotification);
export default adminroute;