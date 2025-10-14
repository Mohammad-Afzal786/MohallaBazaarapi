import Order from "../models/Order.js";

// 🔹 GET - Track a single order by orderId
const trackSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res
        .status(400)
        .json({ status: "error", message: "orderId is required" });
    }

    // 🔹 Find order by orderId
    const order = await Order.findOne({ orderId }).lean();

    if (!order) {
      return res
        .status(404)
        .json({ status: "error", message: "Order not found" });
    }

    // 🔹 Format response
    const formattedOrder = {
      orderId: order.orderId,
      status: order.status,
      currentStep: order.currentStep, // 0=Placed, 1=Packed, 2=Out for Delivery, 3=Delivered
      estimatedDelivery: order.estimatedDelivery,
      grandTotal: order.grandTotal,
      cartItemCount: order.cartItemCount,
      totalCartProductsAmount: order.totalCartProductsAmount,
      totalCartDiscountAmount: order.totalCartDiscountAmount,
      totalSaveAmount: order.totalSaveAmount,
      handlingCharge: order.handlingCharge,
      deliveryCharge: order.deliveryCharge,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      
    };

    return res.status(200).json({
      status: "success",
      message: "Order details fetched successfully",
      data: formattedOrder,
    });
  } catch (error) {
    console.error("❌ Error in trackSingleOrder:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching order details",
    });
  }
};

export { trackSingleOrder };
