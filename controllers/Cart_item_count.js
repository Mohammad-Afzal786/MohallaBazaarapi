// controllers/cartController.js
import Cart from "../models/cartSchema.js";

const getCartCount = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "userId is required",
      });
    }

    // 🔹 Fetch user cart items
    const cartItems = await Cart.find({ userId });

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "Cart is empty",
        data: {
          userId,
          cartItemCount: 0,
        },
      });
    }

    // 🔹 Count total items (by quantity)
    const cartItemCount = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    return res.status(200).json({
      status: "success",
      message: "Cart count fetched successfully",
      data: {
        userId,
        cartItemCount,
      },
    });
  } catch (err) {
    console.error("Error in getCartCount:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching cart count",
    });
  }
};

export { getCartCount };
