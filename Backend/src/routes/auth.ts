import { Router } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import prisma from "../db";
import axios from "axios";
import { requireLocalAuth } from "../middleware/requireLocalAuth";
import { JWT_SECRET, BCRYPT_ROUNDS } from "../config";

const router = Router();

const getTodayDate = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

router.post("/register", async (req, res) => {
  try {
    const { email, password, role, name, roleTitle, department } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ error: "email, password, role required" });

const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: { email, password: hash, role },
    });

    // if operator, optionally create Employee profile
    if (role === "OPERATOR") {
      await prisma.employee.create({
        data: {
          userId: user.id,
          name: name ?? email.split("@")[0],
          roleTitle: roleTitle ?? "Operator",
          department: department ?? "Operations",
        },
      });
    }

    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "register failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      userId: user.id,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", async (_req, res) => {
  return res.json({ message: "Logged out successfully" });
});



router.post("/token", async (req, res) => {
  try {
    const url = `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const body = new URLSearchParams({
      client_id: process.env.KEYCLOAK_AUDIENCE!,
      client_secret: process.env.KEYCLOAK_AUDIENCE_SECRET!,
      grant_type: "client_credentials",
    });

    const { data } = await axios.post(url, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to get token" });
  }
});

router.get("/me", requireLocalAuth, async (req, res) => {
  try {
    console.log("📍 /auth/me endpoint called");
    console.log("Request user object:", req.user);

    const userId = (req.user as any)?.id;

    if (!userId) {
      console.error("❌ No user ID found in token");
      return res.status(401).json({ error: "Unauthorized - No user ID in token" });
    }

    // Fetch fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("❌ User not found in database:", userId);
      return res.status(401).json({ error: "User not found" });
    }

    console.log("✅ User fetched successfully:", { id: user.id, email: user.email, role: user.role });

    return res.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Error in /auth/me:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

// router.get("/go-to-hrm", ensureFreshKeycloakToken, async (req, res) => {
//   try {
//     const { tenantCode } = req.query;
//     const backend_url = process.env.HRM_BACKEND_ROUTE;

//     if (!tenantCode)
//       return res.status(400).json({ error: "tenantCode is required" });

//     const accessToken = req.validAccessToken;

//     // Redirect to HRM frontend
//     const hrmRedirectUrl = `${backend_url}/api/tenant/sso-login/${tenantCode}?token=${accessToken}&sso=1`;
//     res.json({ redirectUrl: hrmRedirectUrl });
//   } catch (err: any) {
//     console.error("Redirect failed:", err.message);
//     res.status(500).json({ error: "Failed to redirect to HRM" });
//   }
// });

export default router;
