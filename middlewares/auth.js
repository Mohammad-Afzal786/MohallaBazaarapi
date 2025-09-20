import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * @middleware auth
 * @desc Verify JWT Access Token & attach user payload to req.user
 * @access Private (use in protected routes)
 * 
 * 📌 Flow:
 * 1. Client हर protected API request में `Authorization: Bearer <access_token>` header भेजेगा।
 * 2. Middleware token को header से extract करेगा।
 * 3. JWT.verify() से token validate होगा (expiry + secret check)।
 * 4. Valid होने पर decoded payload (जैसे userId) `req.user` में attach किया जाएगा।
 * 5. Invalid / expired होने पर 401 Unauthorized response मिलेगा।
 * 
 * 🔐 Example Request:
 * GET /api/profile
 * Headers: { "Authorization": "Bearer <your_access_token>" }
 * 
 * ✅ Example Success:
 * req.user = { userId: "64c1234abc..." }
 * आगे controller को पता चलेगा किस user का data fetch करना है।
 * 
 * ❌ Error Responses:
 * { "message": "No token, authorization denied" }   // missing header
 * { "message": "Token is not valid" }               // tampered / invalid
 * { "message": "Access token expired" }             // expired
 */

const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId: "xxxx", iat: ..., exp: ... }
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired" });
        }

        res.status(401).json({ message: "Token is not valid" });
    }
};

export default auth;
