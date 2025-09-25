import express from "express";

import { getallrecord, createallrecord } from "../controllers/Controllers.js";
import { createUser } from "../controllers/UserRagisterationControllers.js";
import loginUser from "../controllers/UserLoginController.js";
import refreshToken from "../controllers/RefreshTokenController.js";
import logoutUser from "../controllers/LogoutController.js";
import resendVerificationEmail from "../controllers/ResendVerificationEmail.js";
import forgotPassword from "../controllers/ForgotPassword.js";
import resetPassword from "../controllers/ResetPassword.js";
import auth from "../middlewares/auth.js";
import getProfile from "../controllers/GetProfile.js";
import updateProfile from "../controllers/updateProfile.js";
import { getCategories } from "../controllers/Getcategory.js";
import { getProducts } from "../controllers/Getparentsproducts.js";

import { getCategoryProducts } from "../controllers/Getcategoryproducts.js";
import { addToCart } from "../controllers/Cart_Opration.js";
import { getCartCount } from "../controllers/Cart_item_count.js";
import { viewCart } from "../controllers/View_Cart.js";
const route = express.Router();





/**
 * ================================
 * Routes
 * ================================
 */


// Get all records
route.get("/", getallrecord);

// Create a new record
route.post("/create", createallrecord);

// Register new user
route.post("/register", createUser);

// Email verification link


// User login with rate limiter applied

route.post("/login", loginUser);

// Refresh JWT token
route.post("/token/refresh", refreshToken);

// Logout user
route.post("/logout", logoutUser);
// resend Email verification link
route.post("/resendverification", resendVerificationEmail);

// forget password
route.post("/forgotpassword", forgotPassword);

// reset password
route.post("/resetpassword", resetPassword);


// Protected route
route.get("/getprofile", auth, getProfile);
route.put("/updateProfile", auth, updateProfile);


route.get("/categories", getCategories);
// Route setup
route.get("/getproducts", getProducts);
route.get("/getCategoryProducts", getCategoryProducts);
route.post("/addtocart", addToCart);

route.get("/viewcart", viewCart);

route.get("/CartCount", getCartCount);
export default route;
