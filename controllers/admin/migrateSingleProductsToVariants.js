// controllers/migrationController.js
import Product from "../../models/ProductModel.js";

/**
 * Migrate ALL products to variants
 * - Creates a variants array for each product
 * - Removes old root-level fields: productprice, productdiscountPrice, productsaveAmount, productquantity
 */
const migrateAllProducts = async (req, res) => {
  try {
    // 1️⃣ Get all products
    const products = await Product.find();

    if (!products.length) {
      return res.status(404).json({
        status: "error",
        message: "No products found in DB",
      });
    }

    let migratedCount = 0;

    // 2️⃣ Loop through each product
    for (const product of products) {
      const discountPrice = product.productdiscountPrice || product.productprice;
      const saveAmount = product.productprice - discountPrice;

      // Create variants array
      product.variants = [
        {
          productquantity: product.productquantity || "1 pc",
          productprice: product.productprice,
          productdiscountPrice: discountPrice,
          productsaveAmount: saveAmount,
          isDefault: true,
          stock: 999,
        },
      ];

      // 3️⃣ Save the product with new variants
      await product.save();

      // 4️⃣ Remove old root-level fields using $unset
      await Product.updateOne(
        { _id: product._id },
        {
          $unset: {
            productprice: "",
            productdiscountPrice: "",
            productsaveAmount: "",
            productquantity: "",
          },
        }
      );

      migratedCount++;
    }

    // 5️⃣ Return response after all products are migrated
    return res.status(200).json({
      status: "success",
      message: `Migrated ${migratedCount} products successfully.`,
    });
  } catch (err) {
    console.error("Error in migrateAllProducts:", err);
    return res.status(500).json({
      status: "error",
      message: "Migration failed",
      error: err.message,
    });
  }
};

export { migrateAllProducts };



