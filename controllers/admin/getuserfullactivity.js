import { UserActivity } from "../../models/userActivitySchema.js";
import User from "../../models/UserRagisterationModel.js";

// 🔹 Get full date-wise user activity summary
const getFullUserActivity = async (req, res) => {
    try {
        // 1️⃣ Fetch all UserActivity records sorted by date descending (latest first)
        const activities = await UserActivity.find().sort({ date: -1 }).lean();

        const summary = [];

        for (const record of activities) {
            const usersWithDetails = [];

            // 2️⃣ Fetch all userIds in this record at once to minimize DB calls
            const userIds = record.users.map(u => u.userId);
            const userInfos = await User.find({ userId: { $in: userIds } }, { _id: 0 }).lean();

            // Convert array to map for faster lookup
            const userMap = {};
            userInfos.forEach(u => {
                userMap[u.userId] = u;
            });

            // 3️⃣ Merge activity info with user info
            for (const userActivity of record.users) {
                const userInfo = userMap[userActivity.userId];

                if (userInfo) {
                    usersWithDetails.push({
                        ...userInfo, // name, phone, registration_date, etc.
                        visits: userActivity.visits,
                        appVersionId: userActivity.appVersionId,
                    });
                } else {
                    // fallback if user not found in DB
                    usersWithDetails.push({
                        userId: userActivity.userId,
                        visits: userActivity.visits,
                        appVersionId: userActivity.appVersionId,
                    });
                }
            }

            // 4️⃣ Sort users by most visits first
            usersWithDetails.sort((a, b) => b.visits - a.visits);

            // 5️⃣ Total visits for this date
            const totalVisits = usersWithDetails.reduce((sum, u) => sum + u.visits, 0);

            summary.push({
                date: record.date,
                totalVisits,
                users: usersWithDetails,
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Full user activity summary fetched",
            data: summary,
        });
    } catch (err) {
        console.error("Error fetching full user activity:", err);
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch user activity",
            error: err.message,
        });
    }
};

export { getFullUserActivity };
