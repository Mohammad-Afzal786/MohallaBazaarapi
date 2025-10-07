import Banner from "../../models/banner.js";

// 🟢 Add Banner
const addBanner = async (req, res) => {
  try {
    const { imageUrl, count } = req.body;

    // 🧩 Validation
    if (!imageUrl) {
      return res.status(400).json({
        status: "error",
        message: "Image URL is required",
      });
    }

    // 🧠 Create new banner document
    const newBanner = new Banner({
      imageUrl,
      count: count || "", // 🧠 use provided count if available
    });

    await newBanner.save();

    return res.status(201).json({
      status: "success",
      message: "Banner added successfully",
      banner: newBanner,
    });
  } catch (error) {
    console.error("❌ Error in addBanner:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to add banner",
      error: error.message,
    });
  }
};


export { addBanner};
