import mongoose from "mongoose";
import Counter from "./Counter.js"; // Used for sequential orderId generation

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, // sequential orderId like O-000001
  userId: { type: String, required: true },

  items: [
    {
      productId: { type: String, required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      productimage: { type: String },
      productquantity: { type: String },
      price: { type: Number, required: true },       // MRP per unit
      discountPrice: { type: Number, required: true }, // Discounted price per unit
      totalProductPrice: { type: Number, required: true },   // MRP × quantity
      totalDiscountPrice: { type: Number, required: true },  // Discount × quantity
      productsaveAmount: { type: Number, required: true }    // Savings per product
    }
  ],

  cartTotalAmount: { type: Number, required: true },
  handlingCharge: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },

  currentStep: { type: Number, default: 0 }, // 0=Placed, 1=Packed, 2=Out for Delivery, 3=Delivered
  estimatedDelivery: { type: String, default: "20 mins" },
  status: { type: String, default: "Placed" } // Order status

}, { timestamps: true });

// 🔹 Pre-save hook → auto-generate sequential orderId
orderSchema.pre("save", async function(next) {
  if (!this.isNew || this.orderId) return next();

  try {
    // Increment counter atomically
    let counter = await Counter.findOneAndUpdate(
      { _id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // Fallback: ensure counter is ahead of last DB record
    const lastOrder = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } }).lean();
    let lastIdNumber = 0;
    if (lastOrder && lastOrder.orderId) {
      const match = lastOrder.orderId.match(/O-(\d+)/);
      if (match) lastIdNumber = parseInt(match[1], 10);
    }

    if (counter.seq <= lastIdNumber) {
      counter = await Counter.findOneAndUpdate(
        { _id: "orderId" },
        { $set: { seq: lastIdNumber + 1 } },
        { new: true, upsert: true }
      );
    }

    this.orderId = `O-${counter.seq.toString().padStart(6, "0")}`;
    return next();
  } catch (err) {
    return next(err);
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
