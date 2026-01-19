import { Router, Request, Response } from "express";
import prisma from "../db";
import { requireLocalAuth } from "../middleware/requireLocalAuth";


const router = Router();

/**
 * ADMIN: Get all users
 * GET /api/users
 */
router.get("/", requireLocalAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
/**
 * ADMIN: Enable / Disable user
 * PATCH /api/users/:id/status
 */
router.patch(
  "/:id/status",
  requireLocalAuth,
  async (req: Request, res: Response) => {
    try {
      const admin = req.user as any;

      if (!admin || admin.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied" });
      }

      const { id } = req.params;

if (!id) {
  return res.status(400).json({ error: "User id is required" });
}
const user = await prisma.user.findUnique({
  where: { id },
});

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          enabled: !user.enabled, // toggle
        },
        select: {
          id: true,
          email: true,
          role: true,
          enabled: true,
        },
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Toggle user status error:", error);
      res.status(500).json({ error: "Failed to update user status" });
    }
  }
);

export default router;
/**
 * ADMIN: Change user role
 * PATCH /api/users/:id/role
 */
router.patch(
  "/:id/role",
  requireLocalAuth,
  async (req: Request, res: Response) => {
    try {
      const admin = req.user as any;

      if (!admin || admin.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied" });
      }

      const { id } = req.params;
      const { role } = req.body;

      if (!id || !role) {
        return res.status(400).json({ error: "User id and role are required" });
      }
const normalizedRole = role.toUpperCase();
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role: normalizedRole },
        select: {
          id: true,
          email: true,
          role: true,
          enabled: true,
        },
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  }
);
/**
 * ADMIN: Dashboard stats
 * GET /api/users/admin/stats
 */
router.get(
  "/admin/stats",
  requireLocalAuth,
  async (req: Request, res: Response) => {
    try {
      const admin = req.user as any;

      if (!admin || admin.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied" });
      }

      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({
        where: { enabled: true },
      });
      const disabledUsers = await prisma.user.count({
        where: { enabled: false },
      });
      const managers = await prisma.user.count({
        where: { role: "MANAGER" },
      });

      res.json({
        totalUsers,
        activeUsers,
        disabledUsers,
        managers,
      });
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  }
);
