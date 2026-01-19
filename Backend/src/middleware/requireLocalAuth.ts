import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const requireLocalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ requireLocalAuth: No Bearer token in Authorization header");
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as any;

    console.log("✅ Token decoded successfully:", decoded);
    req.user = decoded;
    next();
  } catch (err: any) {
    console.error("❌ requireLocalAuth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
