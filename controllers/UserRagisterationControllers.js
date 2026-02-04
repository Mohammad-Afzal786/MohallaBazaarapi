import dotenv from "dotenv";
dotenv.config();
import User from "../models/UserRagisterationModel.js";

const phoneRegex = /^\d{10}$/;

const createUser = async (req, res) => {
    try {
        let { name, phone, fcmtoken } = req.body;

        name = name?.trim();
        phone = phone?.trim();

        // 1️⃣ Required fields
        if (!name || !phone) {
            return res.status(400).json({
                message: "नाम और फ़ोन नंबर भरना ज़रूरी है।",
            });
        }

        // 2️⃣ Phone validation
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                message: "फ़ोन नंबर 10 अंकों का होना चाहिए।",
            });
        }

        // 3️⃣ Check existing user
        let user = await User.findOne({ phone });

        if (user) {
            // 🔹 Update FCM token silently
            if (fcmtoken && user.fcmtoken !== fcmtoken) {
                user.fcmtoken = fcmtoken;
                await user.save();
            }

            // ✅ Reuse existing user
            return res.status(200).json({
                message: "User already exists",
                userId: user.userId,
                name: user.name,
                phone: user.phone,
                fcmtoken: user.fcmtoken || null,


                user: {

                    userId: user.userId,   // sequential ID (U-000001)
                    name: user.name,
                    phone: user.phone,
                    fcmtoken: user.fcmtoken || null,
                },
            });
        }

        // 4️⃣ Create new user
        const savedUser = await new User({
            name,
            password: null,
            phone,
            fcmtoken: fcmtoken || null,
            registration_date: new Date(),
            isVerified: false,
        }).save();


        // ✅ New user response
        return res.status(201).json({
            message: "User created successfully",

            userId: savedUser.userId,
            name: savedUser.name,
            phone: savedUser.phone,
            fcmtoken: savedUser.fcmtoken || null,
            user: {

                userId: savedUser.userId,
                name: savedUser.name,
                phone: savedUser.phone,
                fcmtoken: savedUser.fcmtoken || null,
            },
        });
    } catch (err) {
        console.error("Error in createUser:", err);
        return res.status(500).json({
            message: "Something went wrong, please try again later.",
        });
    }
};

export { createUser };
