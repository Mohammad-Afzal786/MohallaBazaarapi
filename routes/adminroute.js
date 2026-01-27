import express from "express";
import { createCategory } from "../controllers/admin/createCategoryController.js";

import { createProduct } from "../controllers/admin/createproductController.js";

import { createParentCategory } from "../controllers/admin/Creat_parent_category_crontroller.js";

import { sendNotification } from "../controllers/admin/notification.js";
import { addBanner } from "../controllers/admin/bannerController.js";
import { migrateAllProducts } from "../controllers/admin/migrateSingleProductsToVariants.js";
import {
    appversion,
    insertAppVersion,
} from "../controllers/admin/appVersionRoute.js";


const adminroute = express.Router();
/**
 * ================================
 * Routes
 * ================================
 */
adminroute.post("/create_category", createCategory);
adminroute.post("/create_products", createProduct);
// Parent Category Routes
adminroute.post("/create_parent_category", createParentCategory);
adminroute.post('/send-notification', sendNotification);
adminroute.post('/addbanner', addBanner);
adminroute.get('/appversion', appversion);
adminroute.post("/insertAppVersion", insertAppVersion);   // Admin use karega

adminroute.get("/migrate-last-product", migrateAllProducts);
export default adminroute;