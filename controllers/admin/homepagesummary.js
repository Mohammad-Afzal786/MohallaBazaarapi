import Order from "../../models/Order.js";
const homepageSummary = async (req, res) => {
  try {
    const pendingStatuses = ["Placed", "Confirmed", "Preparing"];

    // 📅 Today range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.find({}, { status: 1, createdAt: 1 }).lean();

    const pendingCount = orders.filter(o =>
      pendingStatuses.includes(o.status)
    ).length;

    const todayCount = orders.filter(
      o => o.createdAt >= startOfDay && o.createdAt <= endOfDay
    ).length;

    const allCount = orders.length;

    res.status(200).json({
      status: "success",
      message: "Homepage summary fetched successfully",
      data: [
        {
          title: "Pending Orders",
          image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          count: pendingCount
        },
        {
          title: "Today Orders",
          image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          count: todayCount
        },
        {
          title: "All Orders",
          image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          count: allCount
        }
      ]
    });

  } catch (err) {
    console.error("Homepage summary error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch homepage summary"
    });
  }
};
export { homepageSummary };
