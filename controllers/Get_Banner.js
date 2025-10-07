import Banner from "../models/banner.js";

// 🟡 Get All Banners
const getBanners = async (req, res) => {
  try {
    // 🔹 Fetch all banners, latest first
    const banners = await Banner.find().sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      message: "Banners fetched successfully",
     
      banners,
    });
  } catch (error) {
    console.error("❌ Error in getBanners:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch banners",
      error: error.message,
    });
  }
};

export {  getBanners };
