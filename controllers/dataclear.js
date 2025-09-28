// controllers/orderController.js

import Order from "../models/Order.js";

const cleartable = async (req, res) => {
  try {
    await Order.deleteMany({});
    res.status(200).json({ message: "All orders deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export { cleartable };