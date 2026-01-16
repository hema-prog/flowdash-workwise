import { Router } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import prisma from "../db";
import { ensureFreshKeycloakToken } from "../middleware/validateKeycloakBeforeHRM";
import axios from "axios";
import { auth } from "../middleware/auth";
const JWT_SECRET = "dev_jwt_secret_key";

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

    const hash = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_ROUNDS) || 10
    );
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


router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies["keycloak_refresh_token"];

    if (!refreshToken) {
      return res.status(400).json({ error: "No refresh token found" });
    }

    const logoutUrl = `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout`;

    const body = new URLSearchParams({
      client_id: process.env.KEYCLOAK_PROVISIONER_CLIENT_ID!,
      client_secret: process.env.KEYCLOAK_PROVISIONER_CLIENT_SECRET!,
      refresh_token: refreshToken,
    });

    await axios.post(logoutUrl, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    //  Remove cookies
    res.clearCookie("keycloak_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("keycloak_refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const today = getTodayDate();
    const now = new Date();

    const userId = req.user?.id;

    if (!userId) {
      return res.status(500).json({ error: "User not found" });
    }

    /* ---------------- ATTENDANCE LOGOUT ---------------- */

    const attendance = await prisma.userAttendance.findUnique({
      where: {
        userId_workDate: {
          userId,
          workDate: today,
        },
      },
      include: {
        breakLogs: true,
      },
    });

    if (attendance && attendance.isActiveSession) {
      let totalBreakMinutes = attendance.totalBreakMinutes;

      // 🔴 Edge case: user logs out during a break
      const openBreak = attendance.breakLogs
        .filter(b => !b.breakEnd)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

      if (openBreak) {
        const breakMinutes = Math.ceil(
          (now.getTime() - openBreak.breakStart.getTime()) / 60000
        );

        await prisma.breakLog.update({
          where: { id: openBreak.id },
          data: { breakEnd: now },
        });

        totalBreakMinutes += breakMinutes;
      }

      const totalWorkedMinutes = Math.max(
        Math.floor(
          (now.getTime() - attendance.loginTime.getTime()) / 60000
        ) - totalBreakMinutes,
        0
      );

      await prisma.userAttendance.update({
        where: { id: attendance.id },
        data: {
          logoutTime: now,
          totalBreakMinutes,
          totalWorkingMinutes: totalWorkedMinutes,
          isActiveSession: false,
          breakStartTime: null,
          breakEndTime: null,
        },
      });

      console.log("✅ Attendance closed:", attendance.id);
    }


    return res.json({ message: "Logged out successfully" });
  } catch (err: any) {
    console.error("Logout Error:", err.response?.data || err.message);
    return res.status(500).json({
      error: err?.message || "Failed to log out",
    });
  }
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

router.get("/me", auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) { }
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


router.get("/go-to-hrm", ensureFreshKeycloakToken, async (req, res) => {
  try {
    const backend_url = process.env.HRM_BACKEND_ROUTE;
    const accessToken: any = req.validAccessToken;

    const payload: any = jwt.decode(accessToken);
    const roles = payload.realm_access?.roles || [];

    const tenantRole = roles.find((r: string) =>
      r.startsWith("TENANT_")
    );

    if (!tenantRole) {
      return res.status(403).json({ error: "Tenant role missing" });
    }

    //TODO: in future change this to the database -> TenantCode
    const TENANT_ROLE_TO_CODE: Record<string, string> = {
      TENANT_DOTSPEAK: "DotSpeak_NGO-11-25-002"
    };

    const tenantCode = TENANT_ROLE_TO_CODE[tenantRole];

    if (!tenantCode) {
      return res.status(403).json({ error: "Tenant not mapped" });
    }

    // SAME HRM API AS BEFORE
    const hrmRedirectUrl =
      `${backend_url}/api/tenant/sso-login/${tenantCode}?token=${accessToken}&sso=1`;

    res.json({ redirectUrl: hrmRedirectUrl });
  } catch (err: any) {
    console.error("Redirect failed:", err.message);
    res.status(500).json({ error: "Failed to redirect to HRM" });
  }
});


export default router;
