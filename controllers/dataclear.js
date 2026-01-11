// controllers/orderController.js

import cartSchema from "../models/cartSchema.js";

const cleartable = async (req, res) => {
  try {
    await cartSchema.deleteMany({});
    res.status(200).json({ message: "All orders deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export { cleartable };