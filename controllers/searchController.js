import Product from "../models/ProductModel.js";

// 🔥 Normalize string
const normalize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// 🔥 Word-based regex search
const buildSearchFilter = (query) => {
  const words = normalize(query).split(" ").filter(w => w.length > 1);
  if (!words.length) return {};
  return {
    $and: words.map(word => ({
      productName: { $regex: word, $options: "i" }
    }))
  };
};

const unifiedSearch = async (req, res) => {
  try {
    const { q, type } = req.query;
    if (!q) {
      return res.json({ status: "success", data: [] });
    }

    const filter = {
      isActive: true,
      ...buildSearchFilter(q),
    };

    // 🔹 SUGGESTIONS (name + image)
    if (type === "suggestions") {
      const products = await Product.find(filter)
        .select("productName productimage") // 👈 image field
        .limit(10);

      return res.json({
        status: "success",
        type: "suggestions",
        data: products.map(p => ({
          name: p.productName,
          image: p.productimage || ""
        })),
      });
    }

    // 🔹 FULL SEARCH
    const products = await Product.find(filter);

    return res.json({
      status: "success",
      type: "full",
      message: `${products.length} products found`,
      data: {
        cartList: products,
      },
    });

  } catch (err) {
    console.error("Search Error:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Search failed" });
  }
};

export { unifiedSearch };
