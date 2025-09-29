import Order from "../models/Order.js";

const orderHistory = async (req, res) => {
  try {
    const { userId } = req.query; // userId path parameter

    if (!userId) {
      return res.status(400).json({ status: "error", message: "userId is required" });
    }

    // 🔹 Fetch all orders for the user, latest first
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ status: "error", message: "No orders found" });
    }

    // 🔹 Format response
    const formattedOrders = orders.map(order => ({
      orderId: order.orderId,
      status: order.status,
    
      currentStep: order.currentStep,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
       // 🔹 Billing summary
      cartItemCount: order.cartItemCount,
      totalCartProductsAmount: order.totalCartProductsAmount,
      totalCartDiscountAmount: order.totalCartDiscountAmount,
      totalSaveAmount: order.totalSaveAmount,
      handlingCharge: order.handlingCharge,
      deliveryCharge: order.deliveryCharge,
      grandTotal: order.grandTotal,

      items: order.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        discountPrice: item.discountPrice,
        productquantity:item.productquantity,
        productimage: item.productimage,
        totalProductPrice: item.totalProductPrice,
        totalDiscountPrice: item.totalDiscountPrice,
        productsaveAmount: item.productsaveAmount
      }))
    }));

    return res.status(200).json({
      status: "success",
      message: "Order history fetched successfully",
      data: formattedOrders
    });

  } catch (err) {
    console.error("Error in orderHistory:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching order history"
    });
  }
};

export { orderHistory };
