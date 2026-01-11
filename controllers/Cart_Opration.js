// controllers/cartController.js
import Cart from "../models/cartSchema.js";
import Product from "../models/ProductModel.js";

const addToCart = async (req, res) => {
  try {
    let { userId, productId, variantId, action } = req.body;

    userId = userId?.trim();
    productId = productId?.trim();
    action = action?.trim();

    // 1️⃣ Validation
    if (!userId || !productId || !variantId || !action) {
      return res.status(400).json({
        status: "error",
        message: "userId, productId, variantId and action are required",
      });
    }

    // 2️⃣ Product + Variant check
    const product = await Product.findOne({
      productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found or inactive",
      });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({
        status: "error",
        message: "Variant not found",
      });
    }

    if (variant.stock <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Variant out of stock",
      });
    }

    // 3️⃣ Find cart item
    let cartItem = await Cart.findOne({ userId, productId, variantId });

    // ================= UPDATE EXISTING =================
    if (cartItem) {
      if (action === "increment") {
        if (cartItem.quantity >= variant.stock) {
          return res.status(400).json({
            status: "error",
            message: "Stock limit reached",
          });
        }
        cartItem.quantity += 1;
      } 
      else if (action === "decrement") {
        cartItem.quantity -= 1;
      } 
      else {
        return res.status(400).json({
          status: "error",
          message: "Invalid action",
        });
      }

      // Remove if quantity zero
      if (cartItem.quantity <= 0) {
        await Cart.deleteOne({ _id: cartItem._id });
        cartItem = null;
      } else {
        await cartItem.save();
      }
    }

    // ================= CREATE NEW =================
    else {
      if (action !== "increment") {
        return res.status(400).json({
          status: "error",
          message: "Cannot decrement non-existing cart item",
        });
      }

      cartItem = await Cart.create({
        userId,
        productId,
        variantId,
        quantity: 1,
      });
    }

    // 4️⃣ Total cart count
    const totalAgg = await Cart.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);

    return res.status(200).json({
      status: "success",
      message: "Cart updated successfully",
      totalCartItem: totalAgg[0]?.total || 0,
      data: cartItem,
    });

  } catch (err) {
    console.error("Error in addToCart:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while updating cart",
    });
  }
};

export { addToCart };
