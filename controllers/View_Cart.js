// controllers/cartController.js
import Product from "../models/ProductModel.js";
import Cart from "../models/cartSchema.js";

const viewCart = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ status: "error", message: "userId is required" });
    }

    // 1️⃣ Fetch cart items
    const cartItems = await Cart.find({ userId });

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "Cart is empty",
        data: {
          userId,
          cartItemCount: 0,
          cartTotalAmount: 0,
          handlingCharge: 0,
          deliveryCharge: 0,
          needToAddForFreeDelivery: 0,
          grandTotal: 0,
          totalCartDiscountAmount: 0,
          totalCartProductsAmount: 0,
          totalSaveAmount: 0,
          cartList: [],
        },
      });
    }

    // 2️⃣ Fetch products
    const productIds = cartItems.map(item => item.productId);
    const products = await Product.find({ productId: { $in: productIds } });

    let cartTotalAmount = 0;
    let cartItemCount = 0;
    let totalCartDiscountAmount = 0;
    let totalCartProductsAmount = 0;
    let totalSaveAmount = 0;

    // 3️⃣ Map cart items with per-product totals
    const cartList = cartItems.map(item => {
      const product = products.find(p => p.productId === item.productId);
      if (!product) return null;

      const quantity = item.quantity;
      const price = product.productprice || 0;
      const discountPrice = product.productdiscountPrice || price;

      // per-product totals
      const totalProductPrice = price * quantity;          // total MRP
      const totalDiscountPrice = discountPrice * quantity; // total discounted price
      const productsaveAmount = totalProductPrice - totalDiscountPrice;

      // overall totals
      cartTotalAmount += totalDiscountPrice;
      cartItemCount += quantity;
      totalCartDiscountAmount += totalDiscountPrice;
      totalCartProductsAmount += totalProductPrice;
      totalSaveAmount += productsaveAmount;

      return {
        ...product.toObject(),
        quantity,
        productprice: totalProductPrice,
        productdiscountPrice: totalDiscountPrice,
        productsaveAmount
      };
    }).filter(Boolean);

    // 4️⃣ Totals & delivery
    const handlingCharge = 0;
    const deliveryChargeFreeAmount = 0;
    const deliveryCharge = cartTotalAmount >= deliveryChargeFreeAmount ? 0 : 0;
    const grandTotal = cartTotalAmount + handlingCharge + deliveryCharge;
    const needToAddForFreeDelivery = cartTotalAmount >= deliveryChargeFreeAmount
      ? 0
      : deliveryChargeFreeAmount - cartTotalAmount;

    // 5️⃣ Send response
    return res.status(200).json({
      status: "success",
      message: "Cart fetched successfully",
      data: {
        userId,
        cartItemCount,
        cartTotalAmount,
        handlingCharge,
        deliveryCharge,
        needToAddForFreeDelivery,
        grandTotal,
        totalCartDiscountAmount,
        totalCartProductsAmount,
        totalSaveAmount,
        cartList
      }
    });

  } catch (err) {
    console.error("Error in viewCart:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching the cart"
    });
  }
};

export { viewCart };
