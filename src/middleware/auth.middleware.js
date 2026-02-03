import jwt from "jsonwebtoken";
import env_config from "../config/env.config.js";

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("[AUTH] Authorization header:", authHeader ? "Present" : "Missing");

    const token = authHeader?.split(" ")[1];

    if (!token) {
      console.log("[AUTH] No token found in header");
      return res.status(401).json({ message: "Access token missing" });
    }

    console.log("[AUTH] Token received, verifying...");
    const decoded = jwt.verify(token, env_config.ACCESS_TOKEN_SECRET);
    console.log("[AUTH] Token verified, user:", decoded);

    req.user = decoded;
    next();

  } catch (err) {
    console.error("[AUTH] Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
