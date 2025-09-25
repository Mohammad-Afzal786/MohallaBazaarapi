// controllers/cartController.js
import Cart from "../models/cartSchema.js";   // dhyan: space hata do "cartSchema .js"
import Product from "../models/ProductModel.js";


const addToCart = async (req, res) => {
  try {
    let { userId, productId } = req.body;

    // 1️⃣ Clean inputs
    userId = userId?.trim();
    productId = productId?.trim();

    // 2️⃣ Validation
    if (!userId || !productId) {
      return res.status(400).json({
        status: "error",
        message: "userId and productId are required",
      });
    }

    // 3️⃣ Product check
    const product = await Product.findOne({ productId: productId }); 
    if (!product || !product.isActive) {
      return res.status(404).json({
        status: "error",
        message: "Product not found or inactive",
      });
    }

    // 4️⃣ Check cart for this user + product
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      // ✅ Already exists → increment quantity by 1
      cartItem.quantity += 1;
      const updated = await cartItem.save();

      // 🔹 Get total cart items for this user
      const totalCartItemsAgg = await Cart.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]);
      const totalCartItems = totalCartItemsAgg[0]?.total || 0;

      return res.status(200).json({
        status: "success",
        message: "Cart quantity updated (+1)",
        totalCartItem: totalCartItems,
        data: updated,
      });
    }

    // 5️⃣ New entry → set quantity = 1
    const newCart = new Cart({
      userId,
      productId,
      quantity: 1,
    });
    const savedCart = await newCart.save();

    // 🔹 Get total cart items for this user (including new entry)
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
  } catch (err) {
    console.error("Error in addToCart:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while adding to cart",
    });
  }
};

export { addToCart };
