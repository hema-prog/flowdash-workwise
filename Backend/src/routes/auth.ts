import { Router } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import prisma from "../db";
import axios from "axios";

const router = Router();

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
    if (!email || !password)
      return res.status(400).json({ error: "email & password required" });

    // 1️⃣ Authenticate with Keycloak
    const tokenUrl = `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const body = new URLSearchParams({
      grant_type: "password",
      client_id: process.env.KEYCLOAK_AUDIENCE!,          // e.g. hrm-backend
      client_secret: process.env.KEYCLOAK_AUDIENCE_SECRET!, // from Credentials tab
      username: email,
      password,
    });

    let kc;
    try {
      const { data } = await axios.post(tokenUrl, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      kc = data;
    } catch (err: any) {
      return res.status(401).json({ error: "Invalid credentials (Keycloak)" });
    }

    // 2️⃣ Decode Keycloak access token to extract info
    const decoded = JSON.parse(
      Buffer.from(kc.access_token.split(".")[1], "base64").toString("utf8")
    );

    const keycloakSub = decoded.sub;
    const roles = decoded.realm_access?.roles || [];
    const role = roles.includes("MANAGER") ? "MANAGER" : "OPERATOR";

    // 3️⃣ Find or create user in Prisma
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password: "", // handled by Keycloak
          role,
        },
      });
    }

    // 4️⃣ Link with ExternalIdentity table
    await prisma.externalIdentity.upsert({
      where: { email },
      update: { subject: keycloakSub },
      create: {
        provider: "keycloak",
        subject: keycloakSub,
        email,
        userId: user.id,
      },
    });

    // 5️⃣ Return your app’s own JWT for frontend
    const appToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      token: appToken,                // your app token (frontend uses this)
      role: user.role,
      userId: user.id,
      email
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e?.message || "login failed" });
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

export default router;
