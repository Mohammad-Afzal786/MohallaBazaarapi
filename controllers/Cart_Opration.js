// controllers/cartController.js
import Cart from "../models/cartSchema.js";   // ध्यान: space हटाया
import Product from "../models/ProductModel.js";

const addToCart = async (req, res) => {
  try {
    let { userId, productId, action } = req.body;

    // 1️⃣ Clean inputs
    userId = userId?.trim();
    productId = productId?.trim();
    action = action?.trim(); // "increment" या "decrement"

    // 2️⃣ Validation
    if (!userId || !productId || !action) {
      return res.status(400).json({
        status: "error",
        message: "userId, productId and action are required",
      });
    }

    // 3️⃣ Product check
    const product = await Product.findOne({ productId }); 
    if (!product || !product.isActive) {
      return res.status(404).json({
        status: "error",
        message: "Product not found or inactive",
      });
    }

    // 4️⃣ Check cart for this user + product
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      // ✅ Update quantity based on action
      if (action === "increment") {
        cartItem.quantity += 1;
      } else if (action === "decrement") {
        cartItem.quantity = Math.max(cartItem.quantity - 1, 0); // minimum 0
      } else {
        return res.status(400).json({
          status: "error",
          message: "Invalid action. Must be 'increment' or 'decrement'",
        });
      }

      // Remove item if quantity becomes 0
      if (cartItem.quantity === 0) {
        await Cart.deleteOne({ _id: cartItem._id });
      } else {
        await cartItem.save();
      }

      // 🔹 Get total cart items for this user
      const totalCartItemsAgg = await Cart.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);
      const totalCartItems = totalCartItemsAgg[0]?.total || 0;

      return res.status(200).json({
        status: "success",
        message: `Cart quantity ${action === "increment" ? "increased" : "decreased"}`,
        totalCartItem: totalCartItems,
        data: cartItem.quantity === 0 ? null : cartItem,
      });
    }

    // 5️⃣ New entry → only allow increment
    if (action === "increment") {
      const newCart = new Cart({
        userId,
        productId,
        quantity: 1,
      });
      const savedCart = await newCart.save();

      // 🔹 Total cart items
      const totalCartItemsAgg = await Cart.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);
      const totalCartItems = totalCartItemsAgg[0]?.total || 0;

      return res.status(201).json({
        status: "success",
        message: "Product added to cart",
        totalCartItem: totalCartItems,
        data: savedCart,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Cannot decrement a product that is not in the cart",
      });
    }
  } catch (err) {
    console.error("Error in addToCart:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while updating cart",
    });
  }
};

export { addToCart };
