import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },

    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    
  },
  // 🔥 prevent duplicate same variant
 
  { timestamps: true }
);
// 🔥 prevent duplicate same variant
cartSchema.index(
  { userId: 1, productId: 1, variantId: 1 },
  { unique: true }
);

export default mongoose.model("Cart", cartSchema);
