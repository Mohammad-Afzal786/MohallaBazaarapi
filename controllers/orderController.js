import Cart from "../models/cartSchema.js";
import Product from "../models/ProductModel.js";
import Order from "../models/Order.js";

const orderNow = async (req, res) => {
  try {
    const { userId, useraddress } = req.body;

    if (!userId || !useraddress) {
      return res.status(400).json({
        status: "error",
        message: "userId and useraddress are required"
      });
    }

    // 1️⃣ Fetch cart items
    const cartItems = await Cart.find({ userId });
    if (!cartItems.length) {
      return res.status(400).json({
        status: "error",
        message: "Cart is empty"
      });
    }

    // 2️⃣ Fetch products
    const productIds = cartItems.map(i => i.productId);
    const products = await Product.find({
      productId: { $in: productIds },
      isActive: true
    }).lean();

    let cartItemCount = 0;
    let totalCartProductsAmount = 0;
    let totalCartDiscountAmount = 0;
    let totalSaveAmount = 0;
    let cartTotalAmount = 0;

    const orderItems = [];

    // 3️⃣ Build order items (VARIANT SAFE)
    for (const item of cartItems) {
      const product = products.find(p => p.productId === item.productId);
      if (!product) continue;

      const variant = product.variants.find(
        v => v._id.toString() === item.variantId.toString()
      );
      if (!variant) continue;

      const quantity = item.quantity;

      // ✅ CORRECT PRICE SOURCE
      const price = Number(variant.productprice) || 0;
      const discountPrice =
        Number(variant.productdiscountPrice) || price;

      const totalProductPrice = price * quantity;
      const totalDiscountPrice = discountPrice * quantity;
      const productsaveAmount = totalProductPrice - totalDiscountPrice;

      cartItemCount += quantity;
      totalCartProductsAmount += totalProductPrice;
      totalCartDiscountAmount += totalDiscountPrice;
      totalSaveAmount += productsaveAmount;
      cartTotalAmount += totalDiscountPrice;

      orderItems.push({
        productId: product.productId,
        productName: product.productName,
        variantId: variant._id,
        quantity,
        productimage: product.productimage,
        productquantity: variant.productquantity,
        price,
        discountPrice,
        totalProductPrice,
        totalDiscountPrice,
        productsaveAmount
      });
    }

    if (!orderItems.length) {
      return res.status(400).json({
        status: "error",
        message: "No valid items to place order"
      });
    }

    // 4️⃣ Charges
    const handlingCharge = 0;
    const deliveryCharge = cartTotalAmount >= 100 ? 0 : 25;
    const grandTotal = cartTotalAmount + handlingCharge + deliveryCharge;

    // 5️⃣ Save order
    const order = await Order.create({
      userId,
      useraddress,
      items: orderItems,
      cartItemCount,
      totalCartProductsAmount,
      totalCartDiscountAmount,
      totalSaveAmount,
      handlingCharge,
      deliveryCharge,
      grandTotal,
      estimatedDelivery: "30 mins",
      currentStep: 0,
      status: "Placed"
    });

    // 6️⃣ Clear cart
    await Cart.deleteMany({ userId });

    return res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      data: order
    });

  } catch (err) {
    console.error("Error in orderNow:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while placing the order"
    });
  }
};

export { orderNow };
