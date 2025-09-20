import dotenv from "dotenv";
dotenv.config();
import User from "../models/UserRagisterationModel.js";
import bcrypt from "bcrypt";

// --- Validators ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^.{6,}$/; // At least 6 characters
const phoneRegex = /^.{10,}$/; // At least 6 characters
// --- Guards: require envs ---
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) throw new Error("EMAIL creds missing");
if (!process.env.BASE_URL) throw new Error("BASE_URL missing");

// --- Register Api ---
const createUser = async (req, res) => {
    try {
        let { firstName, lastName, email, password, registration_date, phone } = req.body;

        // Trim inputs
        firstName = firstName?.trim();
        lastName = lastName?.trim();
        email = email?.trim().toLowerCase();
        phone = phone?.trim();

        // 1️⃣ Required fields check
        if (!firstName || !lastName || !email || !password || !phone) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // 2️⃣ Email format check
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        
        // 2️⃣ phone format check
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Phone must be at least 10 digits" });
        }
        // 3️⃣ Strong password check
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // 4️⃣ Duplicate email check
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // 5️⃣ Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6️⃣ Save user with isVerified = false
        const savedUser = await new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            registration_date: registration_date ?? new Date(),
            phone,
           
        }).save();

        // ✅ Respond to client
        return res.status(201).json({
            message: "User created successfully",
            userId: savedUser._id
        });

    } catch (err) {
        console.error("Error in createUser:", err);
        return res.status(500).json({ message: "Something went wrong, please try again later." });
    }
};

export { createUser };
