import {AppVersion} from "../../models/AppVersion.js";

/**
 * 🔹 GET Latest App Version
 */
const appversion = async (req, res) => {
  try {
    const appInfo = await AppVersion.findOne();

    if (!appInfo) {
      return res.status(404).json({
        status: "error",
        message: "App version info not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Latest app version fetched successfully",
      data: {
        latestVersion: appInfo.version,
        apkUrl: appInfo.apkUrl,
        releaseDate: appInfo.releaseDate,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching app version:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

/**
 * 🔹 INSERT or UPDATE (Single Record)
 */
const insertAppVersion = async (req, res) => {
  try {
    const { version, apkUrl  } = req.body;

    if (!version || !apkUrl  ) {
      return res.status(400).json({
        status: "error",
        message: "version, apkUrl are required",
      });
    }
 

    // 🔹 update if exists, else create
    const appVersion = await AppVersion.findOneAndUpdate(
      {}, // empty filter → first document
      {
        version,
        apkUrl,
       releaseDate: new Date(),
      },
      {
        new: true,      // updated doc return kare
        upsert: true,   // agar nahi mila to create kare
      }
    );

    return res.status(200).json({
      status: "success",
      message: "App version saved successfully",
      data: appVersion,
    });
  } catch (error) {
    console.error("❌ Error saving app version:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export { appversion, insertAppVersion };
