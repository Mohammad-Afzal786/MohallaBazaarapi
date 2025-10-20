import Order from "../models/Order.js";

/**
 * Cancel Order API
 * User can cancel order only if currentStep is 0 (Placed) or 1 (Packed)
 */
const cancelOrderbyuser = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId ) {
      return res.status(400).json({ status: "error", message: "orderId  are required" });
    }

    // 1️⃣ Find the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ status: "error", message: "Order not found" });
    }

    // 2️⃣ Check if order can be canceled
    if (order.currentStep > 2) {
      return res.status(400).json({
        status: "error",
        message: "Order cannot be canceled as it is already out for delivery",
      });
    }

    // 3️⃣ Update order status to "Canceled" and reset currentStep
    order.status = "order cacel by you";
    order.currentStep = -1; // optional, indicate canceled
    await order.save();

    return res.status(200).json({
      status: "success",
      message: "Order canceled successfully",
      data: order,
    });
  } catch (err) {
    console.error("Error in cancelOrder:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while canceling the order",
    });
  }
};

export { cancelOrderbyuser };
