import Cart from "../models/cartSchema.js";
import Product from "../models/ProductModel.js";
import Order from "../models/Order.js";

const orderNow = async (req, res) => {
  try {
    const { userId ,useraddress} = req.body;
    if (!userId) {
      return res.status(400).json({ status: "error", message: "userId is required" });
    }

    // 1️⃣ Fetch cart items
    const cartItems = await Cart.find({ userId });
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ status: "error", message: "Cart is empty" });
    }

    // 2️⃣ Fetch products from DB
    const productIds = cartItems.map(item => item.productId);
    const products = await Product.find({ productId: { $in: productIds } });

    // 3️⃣ Prepare order items and calculate totals
    let cartItemCount = 0;
    let totalCartProductsAmount = 0;
    let totalCartDiscountAmount = 0;
    let totalSaveAmount = 0;
    let cartTotalAmount = 0;

    const orderItems = cartItems.map(item => {
      const product = products.find(p => p.productId === item.productId);
      if (!product) return null;

      const quantity = item.quantity;
      const price = product.productprice || 0;
      const discountPrice = product.productdiscountPrice || price;

      const totalProductPrice = price * quantity;
      const totalDiscountPrice = discountPrice * quantity;
      const productsaveAmount = totalProductPrice - totalDiscountPrice;

      // Update totals
      cartItemCount += quantity;
      totalCartProductsAmount += totalProductPrice;
      totalCartDiscountAmount += totalDiscountPrice;
      totalSaveAmount += productsaveAmount;
      cartTotalAmount += totalDiscountPrice;

      return {
        productId: product.productId,
        productName: product.productName,
        quantity,
        productimage: product.productimage || "",
        productquantity: product.productquantity || "1 pc",
        price,
        discountPrice,
        totalProductPrice,
        totalDiscountPrice,
        productsaveAmount
      };
    }).filter(Boolean);

    // 4️⃣ Calculate charges
    const handlingCharge = 0;
    const deliveryCharge = cartTotalAmount >= 100 ? 0 : 25;
    const grandTotal = cartTotalAmount + handlingCharge + deliveryCharge;

    // 5️⃣ Save order in DB (including all billing fields)
    const newOrder = new Order({
      userId,
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
      status: "Placed",
      useraddress:useraddress
    });

    const savedOrder = await newOrder.save();

    // 6️⃣ Clear user's cart
    await Cart.deleteMany({ userId });

    // 7️⃣ Respond with order details
    return res.status(201).json({
      status: "success",
      message: "Order placed successfully",
      data: savedOrder // sab DB fields already saved
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
