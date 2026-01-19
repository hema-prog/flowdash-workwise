import path from "path";
import dotenv from "dotenv";

// Load environment variables FIRST before any other imports
const envPath = process.env.NODE_ENV === "production" 
  ? path.resolve(process.cwd(), ".env.production")
  : path.resolve(process.cwd(), ".env");

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn("⚠️ .env file not found, using fallback values");
} else {
  console.log("✅ .env file loaded from:", envPath);
}

// Import config after dotenv loads
import { JWT_SECRET } from "./config";

console.log("🔐 JWT_SECRET configured:", JWT_SECRET ? "✓ Available" : "✗ Missing");

import cors from "cors";


import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import usersRoutes from "./routes/users";
import employeeRoutes from "./routes/employees";
import taskRoutes from "./routes/tasks";
import commentRoutes from "./routes/Comment";
import projectManagerRoutes from "./routes/ProjectManager";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:8080"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ REGISTER ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/projectManager", projectManagerRoutes);

// ✅ HEALTH CHECK
app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
